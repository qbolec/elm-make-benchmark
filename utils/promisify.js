module.exports = function promisify(fn) {
    return function () {
        const self = this;
        const args = Array.prototype.slice.call(arguments);

        return new Promise(function (resolve, reject) {
            args.push(function (error, stdout, stderr) {
                if (error) {
                    reject({ error, stderr });
                } else {
                    resolve(stdout);
                }
            });

            fn.apply(self, args);
        });
    }
};
