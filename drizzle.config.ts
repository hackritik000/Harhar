import {defineConfig} from "drizzle-kit"

export default defineConfig({
    schema:"./src/schema/*",
    dialect:"postgresql",
    out:"./drizzle",
    dbCredentials:{
        url:"http://localhost:5432/",
        database:"mydatabase",
        password:"example"
    }
    
})