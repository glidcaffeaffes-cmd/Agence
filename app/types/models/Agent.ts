/**
 * Travel agent / admin user.
 * UML: AgentVoyage
 */
export interface Agent {
  id: number
  firstName: string
  lastName: string
  password: string
  email: string
  address: string
  active: boolean
}
