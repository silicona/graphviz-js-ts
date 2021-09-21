import fs from 'fs';
import path from 'path';

async function esperar(ms: number, results: string[], file: string, done: Function, pending: number) {
    return new Promise((resolve) => {
        filewalker(file, function(err: any, res: any){
            //console.log(res)
            results = results.concat(res);
            if (!--pending) done(null, results);
            
        })
        setTimeout(resolve, ms)
    })
}
/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir 
 * @param {Function} done 
 */
export function filewalker(dir: any, done: any) {
    let results: any[] = [];

    fs.readdir(dir, function(err, list) {
        
        if (err) return done(err);

        list.splice(list.indexOf('node_modules'), 1)

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function(file){
            file = path.resolve(dir, file);

            fs.stat(file, async function(err, stat){
                // If directory, execute a recursive call
                //console.log(stat.)
                if (stat && stat.isDirectory()) {
                    //console.log(file)
                    // Add directory to array [comment if you need to remove the directories from the array]
                    results.push(file);
                    /*
                    filewalker(file, function(err: any, res: any){
                        //console.log(res)
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                        
                    })*/
                    await esperar(5000, results, file, done, pending)

                } else {
                    //console.log(file)
                    results.push(file);

                    if (!--pending) done(null, results);
                }
            });
        });
    });

    //return results
};