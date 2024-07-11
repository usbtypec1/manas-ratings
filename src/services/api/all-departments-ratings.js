export const getAllDepartmentsRatings = async () => {
  const url = `/api/departments`
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}
