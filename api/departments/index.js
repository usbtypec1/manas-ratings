import * as cheerio from 'cheerio'
import axios from 'axios'

const capitalizeFirstLetter = text => text.charAt(0).toUpperCase() + text.slice(1)

const separateKGAndRU = text => text.split('/')
  .map(item => item.trim().toLowerCase())
  .map(capitalizeFirstLetter)


const parseFacultyAndDepartmentNames = htmlString => {
  const soup = cheerio.load(htmlString)
  const title = soup('.modal-title').text().trim()
  const [facultyName, departmentName] = title.split('\n').map(item => item.trim())
  const [facultyNameKG, facultyNameRU] = separateKGAndRU(facultyName)
  const [departmentNameKG, departmentNameRU] = separateKGAndRU(departmentName)

  return {
    facultyName: {
      kg: facultyNameKG,
      ru: facultyNameRU,
    },
    departmentName: {
      kg: departmentNameKG,
      ru: departmentNameRU,
    },
  }
}

const parseQuota = htmlString => {
  const soup = cheerio.load(htmlString)
  let quota
  soup('p').each((index, element) => {
    const elementText = cheerio.load(element).text().trim()
    if (elementText.startsWith('КВОТА:')) {
      quota = Number(elementText.split(':')[1].trim())
    }
  })
  return quota
}

const formatDate = dateString => {
  const [datePart, timePart] = dateString.split(' ')
  const [day, month, year] = datePart.split('/')
  return `${year}-${month}-${day}T${timePart}+06:00`
}

const parseApplications = htmlString => {
  const applications = []

  for (const element of cheerio.load(htmlString)('tr')) {

    const isPassed = element.attribs.class === 'bg-success'

    const tr = cheerio.load(element)

    const ratingTd = tr('td:first')
    const applicantIdTd = ratingTd.next()
    const primaryScoreTd = applicantIdTd.next()
    const secondaryScoreTd = primaryScoreTd.next()
    const createdAtTd = secondaryScoreTd.next()

    const rating = Number(ratingTd.text())
    const applicantId = applicantIdTd.text()
    const primaryScore = Number(primaryScoreTd.text())
    const secondaryScore = Number(secondaryScoreTd.text())
    const createdAt = formatDate(createdAtTd.text())

    applications.push({
      rating,
      applicantId,
      primaryScore,
      secondaryScore,
      createdAt,
      isPassed,
    })
  }

  // remove first element which is the header of the table
  applications.shift()

  return applications
}


const fetchDepartmentStatistics = async (departmentId) => {
  const url = `https://abiturient.manas.edu.kg/page/index.php?r=site%2Fmonitoring-dep&id=${departmentId}`

  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error(error)
    if (error.response.status !== 200) {
      throw new Error('Failed to fetch department')
    }
    throw new Error('Unknown error')
  }
}

const parseDepartmentStatistics = ({ htmlString, departmentId }) => {
  const facultyAndDepartmentNames = parseFacultyAndDepartmentNames(htmlString)
  const quota = parseQuota(htmlString)
  const applications = parseApplications(htmlString)

  return {
    departmentId,
    ...facultyAndDepartmentNames,
    quota,
    applications,
  }
}

const fetchAndParseDepartmentStatistics = async (departmentId) => {
  const htmlString = await fetchDepartmentStatistics(departmentId)
  return parseDepartmentStatistics({ htmlString, departmentId })
}

const getDepartmentsRatings = async (departmentIds) => {
  const tasks = departmentIds.map(departmentId => fetchAndParseDepartmentStatistics(departmentId))
  return await Promise.all(tasks)
}

const departmentIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 24, 25, 26, 27, 28,
  29, 30, 31, 34, 35, 36, 41, 42,
]


export async function GET(request) {
  try {
    const departmentsRatings = await getDepartmentsRatings(departmentIds)
    return new Response(JSON.stringify({ departmentsRatings }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to fetch departments ratings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

}
