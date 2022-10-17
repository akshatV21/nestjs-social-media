import { Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { GridFsStorage } from 'multer-gridfs-storage'

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  gridFsStorage: unknown
  constructor() {
    this.gridFsStorage = new GridFsStorage({
      url: 'mongodb+srv://akshat21:aku1985pika@cluster0.ew0oz.mongodb.net/social_media?',
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const filename = file.originalname.trim()
          const fileInfo = {
            filename: filename,
          }
          resolve(fileInfo)
        })
      },
    })
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    }
  }
}
