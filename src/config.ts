import array from './lib/array.type';
import boolean from './lib/boolean.type';
import date from './lib/date.type';
import file from './lib/file.type';
import key from './lib/key.type';
import number from './lib/number.type';
import object from './lib/object.type';
import string from './lib/string.type';
import uuid from './lib/uuid.type';

export namespace generation {
    export const Auth = true;
    export const config = {
        apiUrl: 'http://localhost:6111'
    };
    export const Tables = {
        Component: {
            _id: key,
            project_id: uuid,
            account_id: uuid,
            file: file,
            group: string
        }
        // Project: {
        //     _id: key,
        //     name: string,
        //     des: string.required(false),
        //     status: number.default(0),
        //     plugins: object,
        //     created_at: date.auto('insert'),
        //     updated_at: date.auto('insert|update')
        // },
        // Account: {
        //     _id: key,
        //     username: string,
        //     password: string,
        //     status: number.default(0),
        //     recover_by: string,
        //     role_ids: array.required(false),
        //     more: object,
        //     created_at: date.auto('insert'),
        //     updated_at: date.auto('insert|update')
        // },
        // Role: {
        //     _id: key,
        //     name: string,
        //     api: array,
        //     web: array,
        //     mob: array,
        //     created_at: date.auto('new Date()').hide(),
        //     updated_at: date.auto('new Date()').hide()
        // },
        // FileConfig: {
        //     _id: key,
        //     project_id: uuid.required(false).hide(),
        //     account_id: uuid.required(false).hide(),
        //     config: object.default({
        //         maxSize: 2046,
        //         maxFile: 2,
        //         ext: '.*'
        //     }),
        //     created_at: date.auto('insert'),
        //     updated_at: date.auto('insert|update')
        // },
        // Files: {
        //     _id: key,
        //     config_id: uuid.required(false).hide(),
        //     project_id: uuid.required(false).hide(),
        //     account_id: uuid.required(false).hide(),
        //     links: file.config([{
        //         returnType: String, // [String] return only path, [Object] return full object file
        //         returnPath: 'images/', // Return path after uploaded
        //         name: 'images', // Field name
        //         uploadDir: 'assets/images', // absolute path where file will be saved to
        //         maxCount: 2
        //     }]),
        //     link: string,
        //     created_at: date.auto('insert'),
        //     updated_at: date.auto('insert|update')
        // },
        // MailConfig: {
        //     _id: key,
        //     project_id: uuid,
        //     account_id: uuid,
        //     name: string,
        //     config: object.default({
        //         host: string,
        //         port: number,
        //         secure: boolean,
        //         auth: object.default({
        //             user: string,
        //             pass: string
        //         })
        //     })
        // },
        // Mail: {
        //     _id: key,
        //     config_id: uuid,
        //     project_id: uuid,
        //     account_id: uuid,
        //     subject: string,
        //     text: string,
        //     html: string,
        //     from: string,
        //     to: array,
        //     cc: array
        // }
    }
}