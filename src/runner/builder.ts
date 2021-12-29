import Docker from "dockerode";
import Dockerode from "dockerode";
import { readdirSync } from "fs";
import path from "path";
import { RUNNER_IMAGE_NAME } from "./constants";

export const prebuildRunnerImage = async (): Promise<any[]> => {
    let docker = new Docker();
    let dockerode = new Dockerode();
    //console.log(await docker.getImage(RUNNER_IMAGE_NAME));
    let images = await docker.listImages();
    //let imageLables = images.filter(i => i.Labels !== null).map(i => Object.keys(i.Labels));
    let runnerPath = path.join(__dirname, "docker-runner");
    console.log("Prebuilding runner image... :P");
    let stream = await docker.buildImage({
        context: runnerPath,
        src: readdirSync(runnerPath)
    }, {t: RUNNER_IMAGE_NAME});
    return new Promise((resolve, reject) => {
        dockerode.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
    });
}