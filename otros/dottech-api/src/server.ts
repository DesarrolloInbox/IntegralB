import "reflect-metadata"
import { container } from 'tsyringe'
import { ExpressApplicationService } from './services/express-application.service'

const PORT = 9000
const { app } = container.resolve(ExpressApplicationService)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
})