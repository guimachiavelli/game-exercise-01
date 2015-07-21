(function() {
    'use strict';

    var Block;

    Block = function(x, y, shape) {
        this.x = x;
        this.y = y;
        this.shape = shape || this.shapes[this.getRandomShape()];

        this.elementRep = this['shape' + this.shape]();
    };

    Block.prototype.shapes = ['L', 'J', 'T', 'O', 'I', 'S', 'Z'];

    Block.prototype.getRandomShape = function() {
        return Math.floor(Math.random() * this.shapes.length);
    };

    Block.prototype.element = function() {
        var element, self;

        self = this;
        element = [];

        this.elementRep.map(function(node, row){
            node.forEach(function(value, column){
                if (value === 1) {
                    element.push([row + self.x, column + self.y - 1]);
                }
            });
        });

        return element;
    };

    Block.prototype.generatedElement = function() {
        return this['shape' + this.shape]();
    };

    Block.prototype.move = function(x, y) {
        x = x === undefined ? 0 : x;
        y = y === undefined ? 1 : y;
        this.x += x;
        this.y += y;
    };

    Block.prototype.rotate = function(direction) {
        var elementCopy;
        direction = direction === 'left' ? 'left' : 'right';

        elementCopy = this.elementRep.slice();

        if (direction === 'right') {
            elementCopy = elementCopy.reverse();
            this.elementRep = this.transpose(elementCopy);
        } else {
            elementCopy = this.transpose(elementCopy);
            this.elementRep = elementCopy.reverse();
        }

    };

    Block.prototype.transpose = function(m) {
        var result = new Array(m[0].length);
        for (var i = 0; i < m[0].length; i++) {
            result[i] = new Array(m.length - 1);
            for (var j = m.length - 1; j > -1; j--) {
                result[i][j] = m[j][i];
            }
        }
        return result;
    };

    Block.prototype.topEdge = function() {
        return this.edge('y', 'min');
    };

    Block.prototype.leftEdge = function() {
        return this.edge('x', 'min');
    };

    Block.prototype.rightEdge = function() {
        return this.edge('x', 'max');
    };

    Block.prototype.bottomEdge = function() {
        return this.edge('y', 'max');
    };

    Block.prototype.edge = function(axis, type) {
        axis = axis === 'x' ? 0 : 1;
        return Math[type].apply(Math, this.element().map(function(i) {
            return i[axis];
        }));
    };

    Block.prototype.forEach = function(callback) {
        this.element().forEach(callback);
    };

    Block.prototype.some = function(callback) {
        return this.element().some(callback);
    };

    Block.prototype.gen = function() {
        var element, self;

        self = this;
        element = [];

        this.elementRep.map(function(node, row){
            node.forEach(function(value, column){
                if (value === 1) {
                    element.push([row + self.x, column + self.y]);
                }
            });
        });

        return element;
    };

    Block.prototype.shapeL = function() {
        var grid = this.grid();

        grid[0][0] = 1;
        grid[0][1] = 1;
        grid[0][2] = 1;
        grid[1][2] = 1;

        return grid;
    };

    //special case
    Block.prototype.shapeO = function() {
        var grid = [[],[]];

        grid[0][0] = 1;
        grid[0][1] = 1;
        grid[1][0] = 1;
        grid[1][1] = 1;

        return grid;
    };

    Block.prototype.shapeJ = function() {
        var grid = this.grid();

        grid[1][0] = 1;
        grid[1][1] = 1;
        grid[1][2] = 1;
        grid[0][2] = 1;

        return grid;
    };

    Block.prototype.shapeI = function() {
        var grid = this.grid();

        grid[1][0] = 1;
        grid[1][1] = 1;
        grid[1][2] = 1;
        grid[1][3] = 1;

        return grid;
    };

    Block.prototype.shapeT = function() {
        var grid = this.grid();

        grid[0][1] = 1;
        grid[1][1] = 1;
        grid[2][1] = 1;
        grid[1][2] = 1;

        return grid;
    };

    Block.prototype.shapeS = function() {
        var grid = this.grid();

        grid[0][2] = 1;
        grid[1][2] = 1;
        grid[1][1] = 1;
        grid[2][1] = 1;

        return grid;
    };

    Block.prototype.shapeZ = function() {
        var grid = this.grid();

        grid[0][1] = 1;
        grid[1][1] = 1;
        grid[1][2] = 1;
        grid[2][2] = 1;

        return grid;
    };

    Block.prototype.grid = function() {
        var width, height, grid, row;

        width = 4;
        grid = [];

        while (width > 0) {
            height = 4;
            row = [];

            while (height > 0) {
                row.push(0);
                height -= 1;
            }

            grid.push(row);
            width -= 1;
        }

        return grid;

    };


    window.Block = Block;

}());
