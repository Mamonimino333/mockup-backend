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
      width: 300,
      height: 500,
<<<<<<< HEAD
      coord: "0,0,248,157, 0,500,248,957, 300,500,748,957, 300,0,748,157"
=======
      coord: "0,0,346,277, 0,500,346,830, 300,500,678,830, 300,0,678,277"
>>>>>>> 6874940ad57c2ae81c372a0d94b077a56cafb58b
    },
    {
      name: "model2",
      width: 300,
      height: 500,
      coord: "0,0,300,219, 0,500,300,866, 300,500,705,866, 300,0,705,219"
    },
    {
      name: "model5",
      width: 300,
      height: 500,
      coord: "0,0,319,224, 0,500,319,801, 300,500,680,801, 300,0,680,224"
    },
    // {
    //   name: "model3",
    //   width: 300,
    //   height: 500,
    //   coord: "0,0,384,506, 0,500,378,787, 300,500,537,777, 300,0,548,484"
    // },
    // {
    //   name: "model4",
    //   width: 300,
    //   height: 500,
    //   coord: "0,0,418,467, 0,500,418,790, 300,500,618,790, 300,0,618,467"
    // }
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
      {apply: ColorActionName.MIX, params: [{r: req.color.r, g: req.color.g, b: req.color.b, a: 1}, 80]},
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
