const _ = require('lodash');
const {
    nodeModule,
    leafModule,
    mainModule
} = require('./templates/caseOf');

function numberToModuleName(n) {
    return n
        .toString(2)
        .replace(/0/g, 'A')
        .replace(/1/g, 'B');
}

function swapAsAndBs(name) {
    return name
        .replace(/A/g, 'X')
        .replace(/B/g, 'A')
        .replace(/X/g, 'B');
}

function modulesWithLeadingB(l) {
    return _.range(Math.pow(2, l - 1), Math.pow(2, l)).map(numberToModuleName);
}

function modulesAtLevel(l) {
    if (l === 0) {
        return [];
    }
    return modulesWithLeadingB(l)
        .concat(modulesWithLeadingB(l).map(swapAsAndBs));
}

module.exports = function generateElmFiles(depth) {
    const nodeModules = _.flatMap(_.range(1, depth), modulesAtLevel)
        .map(name => ({
            relativePath: name + '.elm',
            content: nodeModule(name),
        }));
    const leafModules = modulesAtLevel(depth)
        .map(name => ({
            relativePath: name + '.elm',
            content: leafModule(name),
        }));
    return [
        {
            relativePath: 'Main.elm',
            content: mainModule,
        }
    ].concat(nodeModules, leafModules);
};
