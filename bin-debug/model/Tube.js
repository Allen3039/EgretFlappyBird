var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Tube = (function () {
    function Tube(x, width, height, direction, stageH) {
        this.width = 66;
        this.x = x;
        this.width = width;
        this.height = height;
        this.stageH = stageH;
        this.direction = direction;
        this.init();
    }
    Tube.prototype.init = function () {
        if (this.direction == "down") {
            var texture = RES.getRes('tube_down_png');
            this.image = new egret.Bitmap(texture);
            this.image.height = this.stageH;
            this.image.width = this.width;
            this.image.y = this.height - this.stageH;
            this.image.x = this.x;
        }
        else {
            var texture = RES.getRes('tube_up_png');
            this.image = new egret.Bitmap(texture);
            this.image.height = this.stageH;
            this.image.width = this.width;
            this.image.y = this.stageH - this.height;
            this.image.x = this.x;
        }
    };
    Tube.prototype.update = function () {
        if (this.direction == "down") {
            this.image.x = this.x;
            this.image.y = this.height - this.stageH;
        }
        else {
            this.image.x = this.x;
            this.image.y = this.stageH - this.height;
        }
    };
    return Tube;
}());
__reflect(Tube.prototype, "Tube");
