class BgMap extends egret.DisplayObjectContainer {
    private bmpArr: egret.Bitmap[];
    private rowCount: number;
    private stageW: number;
    private stageH: number;
    private textureH: number;
    private textureW: number;
    private speed: number = 2;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }


    private onAddToStage(event: egret.Event) {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        const texture: egret.Texture = RES.getRes("bg_jpg");
        this.textureH = texture.textureHeight;
        this.textureW = texture.textureWidth;

        this.rowCount = Math.ceil(this.stageW / this.textureW) + 1;

        this.bmpArr = [];
        for (let i: number = 0; i < this.rowCount; i++) {
            let bgBmp: egret.Bitmap = new egret.Bitmap();
            // bgBmp.fillMode = egret.BitmapFillMode.SCALE;
            bgBmp.texture = texture;
            bgBmp.x = this.textureW * i;
            this.bmpArr.push(bgBmp);
            this.addChild(bgBmp);
        }


    }
    /**开始滚动*/
    public start(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    }

    private enterFrameHandler(event: egret.Event) {
        for (let i: number = 0; i < this.rowCount; i++) {
            var bgBmp = this.bmpArr[i];
            bgBmp.x -= this.speed;
        }

        let mvCount = 0;
        for (let i: number = 0; i < this.rowCount; i++) {
            var bgBmp = this.bmpArr[i];
            if (bgBmp.x + this.textureW < 0) {
                mvCount++;
                bgBmp.x = this.bmpArr[this.rowCount - 1].x + mvCount * this.textureW;
            }
        }
        for (let i: number = 0; i < mvCount; i++) {
            this.bmpArr.push(this.bmpArr.shift());
        }

    }

    /**暂停滚动*/
    public pause(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    }
}