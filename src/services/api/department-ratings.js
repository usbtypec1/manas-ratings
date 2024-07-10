export const getDepartmentRatings = async (departmentId) => {
  const url = `/api/departments/${departmentId}`
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch department ratings')
  }
}
