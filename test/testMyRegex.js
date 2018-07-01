const fs = require('fs');
function getMyResult(fileName) {

    fs.readFile(fileName, (error, data) => {
        let command = data.toString('ascii');
        command = command.replace('  ', ' ').replace(/\t/gi, ' ').replace(/\r\n/gi, ' ');
        const match = command.match(/\((.*?)\)/mi)[1]
        let types = [];
        if (match) {
            types = match.split(',').reduce((current, x) => {
                return current.concat(x.split(' ').filter(Boolean).reduce((current, x, i) => {
                    if (i === 0) {
                        return x
                    } else if (i === 1 && !!x) {
                        return x;
                    }
                    return current;
                },null));
            },[]);

        }
        console.log(fileName, types.join(','));
    })
}
getMyResult('test1.sql');
getMyResult('test2.sql');
getMyResult('test3.sql');
getMyResult('test4.sql');