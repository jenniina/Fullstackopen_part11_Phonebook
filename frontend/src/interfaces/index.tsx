export interface person {
  name?: string
  number?: string | number
  id?: string
}
export type user = {
  username: string
  name: string
  password?: string
  id: string
  people: person[]
}

export type newUser = {
  username: string
  name: string
  password: string
}
