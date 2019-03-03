//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

interface TubeCouple {
    downTube: Tube,
    upTube: Tube
}
class Main extends egret.DisplayObjectContainer {



    private state: string = "normal";
    private touching: boolean = false;

    private bg: BgMap;
    // 管子
    private tubes: TubeCouple[] = [];
    // 鸟
    private myBird: dragonBones.EgretArmatureDisplay;

    //管子的宽度
    private tubeWidth: number = 66;

    // 管子之间的水平间距 
    private HGap: number = 400;
    //管子 对数 一对管子 是上下两个
    private maxTubeCoupleCount: number;
    //一对管子之间的垂直空隙
    private VGap: number = 200;

    private speed: number = 2;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {


        //创建背景
        // this.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        this.bg = new BgMap();
        this.addChild(this.bg);
        this.bg.start();


        // 绘制管子
        this.createTubes();

        // 小鸟动画
        let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
        var dragonbonesData = RES.getRes("bird_json");
        var textureData = RES.getRes("texture2_json");
        var texture = RES.getRes("texture2_png");

        egretFactory.parseDragonBonesData(dragonbonesData);
        egretFactory.parseTextureAtlasData(textureData, texture);

        let armatureDisplay: dragonBones.EgretArmatureDisplay = egretFactory.buildArmatureDisplay('rng');

        this.addChild(armatureDisplay);

        armatureDisplay.x = 200;
        armatureDisplay.y = 250;
        armatureDisplay.animation.play('fly_forw', 0);

        this.myBird = armatureDisplay;

        // armatureDisplay.
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            console.log('touching');

            this.touching = true;
        }, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, () => {
            this.touching = false;
        }, this);
    }

    private adjustBird() {
        if (this.touching) {
            this.myBird.y -= 10;
        } else {
            this.myBird.y += 1;
        }
    }

    private createTubes() {
        const {HGap, tubeWidth, VGap} = this;
        this.maxTubeCoupleCount = this.stage.width / (HGap + tubeWidth) * 2;
        const stageHeight = this.stage.stageHeight;
        const remainHeight = stageHeight - VGap - 200; // 预留100 出来 不然管子可能出现高度为0的情况
        for (let i = 0; i < this.maxTubeCoupleCount; i++) {
            const h = Math.round(Math.random() * remainHeight);
            const x = this.stage.stageWidth + i * (tubeWidth + HGap);
            const downTube = new Tube(x, tubeWidth, h + 100, 'down', stageHeight);
            const upTube = new Tube(x, tubeWidth, remainHeight - h + 100, 'up', stageHeight);

            this.tubes.push({
                downTube,
                upTube,
            });

            this.addChild(downTube.image);
            this.addChild(upTube.image);
        }
    }

    private generateTubeCoupleHeight(): { downH: number, upH: number } {
        const stageHeight = this.stage.stageHeight;

        const remainHeight = stageHeight - this.VGap - 200;
        const h = Math.round(Math.random() * remainHeight);
        return {
            downH: h + 100,
            upH: remainHeight - h + 100
        };
    }

    private gameViewUpdate(event: egret.Event) {
        const {tubes, speed, HGap, tubeWidth, state} = this;
        if (state != "normal") {
            return;
        }

        for (let i = 0; i < tubes.length; i++) {
            const tubeCouple: TubeCouple = tubes[i];
            tubeCouple.downTube.x -= speed;
            tubeCouple.downTube.image.x -= speed;

            tubeCouple.upTube.x -= speed;
            tubeCouple.upTube.image.x -= speed;
        }

        for (let i = 0; i < tubes.length; i++) {
            const tubeCouple: TubeCouple = tubes[0];
            if (tubeCouple.downTube.image.x + tubeWidth < 0) {
                const newHeight = this.generateTubeCoupleHeight();
                tubeCouple.downTube.x = tubes[tubes.length - 1].downTube.x + HGap + tubeWidth;
                tubeCouple.downTube.height = newHeight.downH;
                tubeCouple.downTube.update();

                tubeCouple.upTube.x = tubes[tubes.length - 1].upTube.x + HGap + tubeWidth;
                tubeCouple.upTube.height = newHeight.upH;
                tubeCouple.upTube.update();

                tubes.shift();
                tubes.push(tubeCouple);
                continue;
            }
            break;
        }
        this.adjustBird();

        this.collision();
    }

    private intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
    // 碰撞检测
    private collision() {
        const {tubes, myBird, intersectRect} = this;
        const {x, y, height, width} = myBird;
        let testRect = {
            left: x - width / 2 + 10,
            right: x + width / 2,
            top: y - height + 10,
            bottom: y - 10
        };

        for (let i = 0; i < tubes.length; i++) {
            const {downTube, upTube} = tubes[i];
            const {image: {x: x1, y: y1, width: w1, height: h1}} = downTube;
            const {image: {x: x2, y: y2, width: w2, height: h2}} = upTube;

            let rect1 = {
                left: x1,
                right: x1 + w1,
                top: y1,
                bottom: y1 + h1
            };
            let rect2 = {
                left: x2,
                right: x2 + w2,
                top: y2,
                bottom: y2 + h2
            };
            if (intersectRect(testRect, rect1) || intersectRect(testRect, rect2)) {
                this.pause();
            }
        }
    }
    private pause() {
        this.state = "pause";
        this.bg.pause();
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
}