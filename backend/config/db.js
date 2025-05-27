import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv"

dotenv.config();

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;


// create SQL connection using environment variables
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)

//sql funtion exported is used as a tagged template literal which allows us to write sql queries