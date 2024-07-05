import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import generateMockup from './mockup/create_mockup';
import Color from 'color';
import Jimp from 'jimp';
import {ColorActionName} from "@jimp/plugin-color";

const modelData = {
  models: [
    {
      name: "model1",
      width: 302,
      height: 515,
      coord: "0,0,346,277, 0,515,347,720, 302,515,647,720, 302,0,647,279"
    },
    {
      name: "model2",
      width: 255,
      height: 304,
      coord: "0,0,373,330, 0,304,373,634, 255,304,628,634, 255,0,628,330"
    },
    {
      name: "model3",
      width: 418,
      height: 510,
      coord: "0,0,170,657, 0,510,554,993, 418,510,874,683, 418,0,518,425"
    }
  ],
  default: "model1"
}



const hexToRGB = (hex: string): {r: number; g: number, b: number} => {
  hex = hex.replace("#", '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return {r, g, b};
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/models")
  getModels() {
    return modelData;
  }

  @Post("/mockup")
  async mockup(@Body() req) {
    const base64Data = req.logo.replace(/^data:image\/png;base64,/, "");
    await require("fs").writeFileSync("./data/logo.png", base64Data, 'base64');
    const out = `${Math.random().toString(36).substring(7)}.png`;`/temp.png`;
    const model = req.model;
    const data = modelData.models.filter((m) => {
      return m.name === model
    }).at(0);
    console.log(req.color);

    const img = await Jimp.read(`./data/models/${model}/base_images/base.png`);
    img.resize(1000, 1000);
    img.color([
      {apply: ColorActionName.MIX, params: [{r: req.color.r, g: req.color.g, b: req.color.b, a: 1}, 60]},
    ]);
    await img.writeAsync("./data/temp.png");
    const logo = await Jimp.read("./data/logo.png");
    logo.resize(data.width, data.height);
    await logo.writeAsync("./data/logo.png");
    await generateMockup({
      artwork: "./data/logo.png",
      template: "./data/temp.png",
      displacementMap: `./data/models/${model}/maps/displacement_map.png`,
      lightingMap: `./data/models/${model}/maps/lighting_map.png`,
      adjustmentMap: `./data/models/${model}/maps/adjustment_map.jpg`,
      mask: `./data/models/${model}/base_images/mask.png`,
      coord: data.coord,
      out: `./public/${out}`
    });
    return out;
  }
}
