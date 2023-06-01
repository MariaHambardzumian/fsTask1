import { appendFile, copyFile, readdir, rename, statSync, unlink } from 'fs'
import _ from 'lodash'
import { resolve } from 'path'


function update() {
   let  all = []
   readdir('./', function (err, files) {
        if (err) {
            console.log("Error getting directory information.")
        } else {
            files.forEach(function (file) {
                all.push({
                    name: file,
                    type: statSync(file).isDirectory()? 'directory' : 'file'
                })
            })

        }
        all = _.sortBy(all, (o) => o.type)
        console.table(all)
    })
}

process.stdin.on('data', data => {
    data = data.toString().trim()
    switch (true) {
        case data == 'ls':
          update()
            break;
        case data.startsWith('add '):
            let fileName = data.slice(4)
            appendFile(fileName, '', function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            break;
        case data.startsWith('rn '):
            rename(...data.slice(3).split(' '), function (err) {
                if (err) console.log(err);
                else console.log('Saved!');
            });
            break;
        case data.startsWith('cp '):
            copyFile(...data.slice(3).split(' '), function (err) {
                if (err) console.log(err);
                else console.log('Copied!');
            });
            break;
        case data.startsWith('mv '):
            let [oldPath, folder] = data.slice(3).split(' ')
            rename(oldPath, resolve(folder, oldPath), function (err) {
                if (err) console.log(err);
                else console.log('Successfully moved!')
            })
            break;
        case data.startsWith('rm '):
            unlink(data.slice(3), (err)=>{
                if (err) console.log(err);
                else console.log('Successfully removed!')
            })
            break;

        default:
            break;
    }
})

