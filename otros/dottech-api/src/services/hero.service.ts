import { autoInjectable } from "tsyringe";
import { heroes } from '../heroes-db-lite'
import { Hero } from "../interfaces/hero.interface";

@autoInjectable()
export class HeroService {
    #fakeID = 10000
    #heroes: Hero[] = heroes

    findAll(page: number, limit: number): {heroes: Hero[], total: number } {
        const startInidex = (page -1) * limit
        const endIndex = page * limit
        const paginatedHeroes = this.#heroes.slice(startInidex, endIndex)
        return {
            heroes: paginatedHeroes,
            total: heroes.length
        }
    }

    findOne(id: number): Hero {
        return this.#heroes.find(hero => hero.id === id) || {} as Hero
    }

    add(hero: Hero): Hero {
        this.#fakeID++
        hero.id = hero.id ?? this.#fakeID
        this.#heroes = [hero, ...this.#heroes]
        return hero
    }

    delete (id: number): void {
        const hero = this.#find(id)
        if (this.#isNull(hero)) {
            throw new Error('Hero not found')
        }
        this.#heroes = this.#heroes.filter(hero => hero.id !== id)
    }

    #find(id: number): Hero {
        return this.#heroes.find(hero => hero.id === id) || {} as Hero
    }

    #isNull(hero: Hero): boolean {
        return Object.keys(hero).length === 0
    }

    update(id: number, updateHero: Hero | Partial<Hero>): Hero | undefined{
        const hero = this.#find(id)
        if (this.#isNull(hero)) {
            throw new Error('Hero not found')
        }
        let updateHeroResult: Hero | undefined
        this.#heroes = this.#heroes.map( hero => {
            if (hero.id !== id) {
                return hero
            }
            updateHeroResult = {
                ...hero,
                ...updateHero,
                powerstats: {
                    ...hero.powerstats,
                    ...updateHero.powerstats
                }
            }
            return updateHeroResult
        })
        return updateHeroResult
    }
}