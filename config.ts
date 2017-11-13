import array from './src/array.type'
import boolean from './src/boolean.type'
import date from './src/date.type'
import file from './src/file.type'
import key from './src/key.type'
import number from './src/number.type'
import object from './src/object.type'
import string from './src/string.type'
import uuid from './src/uuid.type'

export namespace generation {
  export const RootProject = `../`
  export const Auth = true
  export const Tables = {
    chart: {
      _id: key(),
      project_id: uuid(),
      account_id: uuid(),
      page_id: uuid(),
      oder: number().required(false).default(1),
      options: object(),
      images: file().config([{
        returnType: String, // [String] return only path, [Object] return full object file
        returnPath: 'images/', // Return path after uploaded
        name: 'images', // Field name
        uploadDir: 'assets/images', // absolute path where file will be saved to
        maxCount: 2
      }]),
      created_at: date().auto('insert'),
      updated_at: date().auto('insert|update')
    } as any
  }
}
