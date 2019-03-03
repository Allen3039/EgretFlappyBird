class Tube {
    public x: number;
    public height: number;
    public direction: string; // down or up
    public image: egret.Bitmap;
    public stageH: number;
    private width: number = 66;
    public constructor(x: number, width: number, height: number, direction: string, stageH: number) {
        this.x = x;
        this.width = width;
        this.height = height;
        this.stageH = stageH;
        this.direction = direction;
        this.init();
    }

    public init() {
        if (this.direction == "down") {
            const texture: egret.Texture = RES.getRes('tube_down_png');
            this.image = new egret.Bitmap(texture);
            this.image.height = this.stageH;
            this.image.width = this.width;
            this.image.y = this.height - this.stageH;
            this.image.x = this.x;
        } else {
            const texture: egret.Texture = RES.getRes('tube_up_png');
            this.image = new egret.Bitmap(texture);
            this.image.height = this.stageH;
            this.image.width = this.width;
            this.image.y = this.stageH - this.height;
            this.image.x = this.x;
        }
    }
    public update() {
        if (this.direction == "down") {
            this.image.x = this.x;
            this.image.y = this.height - this.stageH;
        } else {
            this.image.x = this.x;
            this.image.y = this.stageH - this.height;
        }
    }
}