import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helpers/api-erros";
import { roomRepository } from "../repositories/roomRepository";
import { subjectRepository } from "../repositories/subjectRepository";
import { videoRepository } from "../repositories/videoRepository";

export class RoomController {  
  async create(req: Request, res: Response) {
    
    const { name, description } = req.body

    if (!name) {
      throw new BadRequestError("Campo name é obrigatório")
    }

    const newRoom = roomRepository.create({name, description})

    await roomRepository.save(newRoom)

    return res.status(201).json(newRoom)
  }

  async createVideo(req: Request, res: Response) {
    
    const { title, url } = req.body
    const { idRoom } = req.params

    if (!title) {
      throw new BadRequestError("Campo title é obrigatório")
    }

    if (!url) {
      throw new BadRequestError("Campo url é obrigatório")
    }

    const room = await roomRepository.findOneBy({id: Number(idRoom)})

    if(!room) {
      throw new NotFoundError("Aula não existe")
    }

    const newVideo = videoRepository.create({
      room,
      title, 
      url
      })

    await videoRepository.save(newVideo)

    return res.status(201).json(newVideo)
  }

  async roomSubject(req: Request, res: Response) {

    const { subject_id } = req.body
    const { idRoom } = req.params

    const room = await roomRepository.findOneBy({id: Number(idRoom)})

      if(!room) {
        throw new NotFoundError("Aula não existe")
      }

      const subject = await subjectRepository.findOneBy({id: Number(subject_id)})

      if(!subject) {
        throw new NotFoundError("Disciplina não existe")
      }

      const roomUpdate = {
        ...room,
        subjects: [subject]
      }

      await roomRepository.save(roomUpdate)

      return res.status(204).send()
  }

  async list(req: Request, res: Response){
    const rooms = await roomRepository.find({
      relations: {
        subjects: true,
        videos: true
      }
    })

    return res.status(200).json(rooms)
  }
}