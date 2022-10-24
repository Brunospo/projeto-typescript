import { AppDataSource } from "./data-source"
import express from "express"
import router from "./routers/router"


AppDataSource.initialize().then(() => {
    const app = express()

    app.use(express.json())

    app.use(router)

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`)
    })
}).catch(error => console.log(error))
