import { Connection } from "mongoose"

export interface MongooseCache {
	conn: Connection | null
	promise: Promise<Connection> | null
}
