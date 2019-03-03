var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var BgMap = (function (_super) {
    __extends(BgMap, _super);
    function BgMap() {
        var _this = _super.call(this) || this;
        _this.speed = 2;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    BgMap.prototype.onAddToStage = function (event) {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        var texture = RES.getRes("bg_jpg");
        this.textureH = texture.textureHeight;
        this.textureW = texture.textureWidth;
        this.rowCount = Math.ceil(this.stageW / this.textureW) + 1;
        this.bmpArr = [];
        for (var i = 0; i < this.rowCount; i++) {
            var bgBmp = new egret.Bitmap();
            // bgBmp.fillMode = egret.BitmapFillMode.SCALE;
            bgBmp.texture = texture;
            bgBmp.x = this.textureW * i;
            this.bmpArr.push(bgBmp);
            this.addChild(bgBmp);
        }
    };
    /**开始滚动*/
    BgMap.prototype.start = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    };
    BgMap.prototype.enterFrameHandler = function (event) {
        for (var i = 0; i < this.rowCount; i++) {
            var bgBmp = this.bmpArr[i];
            bgBmp.x -= this.speed;
        }
        var mvCount = 0;
        for (var i = 0; i < this.rowCount; i++) {
            var bgBmp = this.bmpArr[i];
            if (bgBmp.x + this.textureW < 0) {
                mvCount++;
                bgBmp.x = this.bmpArr[this.rowCount - 1].x + mvCount * this.textureW;
            }
        }
        for (var i = 0; i < mvCount; i++) {
            this.bmpArr.push(this.bmpArr.shift());
        }
    };
    /**暂停滚动*/
    BgMap.prototype.pause = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    };
    return BgMap;
}(egret.DisplayObjectContainer));
__reflect(BgMap.prototype, "BgMap");
