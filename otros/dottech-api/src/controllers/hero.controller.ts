import { Router, Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { HeroService } from "../services/hero.service";
import { HeroDTO } from "../interfaces/hero.dto";

@autoInjectable()
export class HeroController {
    public router = Router()

    constructor(private heroService: HeroService) {
        this.#setRoutes()
    }

    #setRoutes() {
        this.router.route('/').get(this.#findAll)
        this.router.route('/:id').get(this.#findOne)
        this.router.route('/').post(this.#add)
        this.router.route('/:id').delete(this.#delete)
        this.router.route('/:id').patch(this.#update)
        this.router.route('/:id').put(this.#update)
    }

    #findAll = async (req:Request, res: Response) => {
        try {
            const page = parseInt(req.query.pages as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const result = this.heroService.findAll(page, limit)
            res.send(result)
        }catch(error) {
            res.status(500).send({ error: 'Failed to fecth heroes' })
        }
    }
    
    #findOne = async (req:Request, res: Response) => {
        const hero = this.heroService.findOne(parseInt(req.params.id))
        res.send(hero)
    }
    
    #add = async (req: Request, res: Response) => {
        const hero = new HeroDTO().fromJSON(req.body).toJSON()
        const addHeroResult = this.heroService.add(hero)
        res.send(addHeroResult)
    }
    
    #delete = async (req: Request, res: Response) => {
        try {
            const deleteHeroResult = this.heroService.delete(parseInt(req.params.id))
            res.send(deleteHeroResult)
        }catch (error) {
            res.status(500).send({ error: 'Failed to delete heroe' })
        }
    }

    #update = async (req: Request, res:Response) => {
        const hero = req.body
        try{ 
            const updateHeroResult = this.heroService.update(parseInt(req.params.id), hero)
            res.send(updateHeroResult)
        }catch(error) {
            res.status(404).send({ error:'Failed to update hero' })
        }
    }
}