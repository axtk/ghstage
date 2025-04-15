function getOpacity(i: number, j: number, min: number, max: number) {
    // return min + Math.random()*(max - min);
    return min + .25*(((i + 1) % 2 + 2*(j % 2)) + (.25 + .5*Math.random()))*(max - min);
    // return min + .5*((i + 1) % 2 + Math.random())*(max - min);
    // return min + .5*((j + 1) % 2 + Math.random())*(max - min);
}

export type BackgroundOptions = {
    w?: number;
    h?: number;
    nx?: number;
    ny?: number;
    min?: number;
    max?: number;
    color?: string;
    randomX?: boolean;
    randomY?: boolean;
};

export function getBackground({
    w = 1000,
    h = 1000,
    color = 'black',
    min = 0,
    max = .15,
    nx = 8,
    ny = 10,
    randomX = true,
    randomY = true,
}: BackgroundOptions = {}) {
    let dx = w/nx;
    let dy = h/ny;

    let x, y;
    let p: [number, number, number][][] = [];
    let fill: string[] = [];

    for (let i = 0; i < ny + 1; i++) {
        p[i] = [];

        for (let j = 0; j < nx; j++) {
            x = (j + .5)*dx;

            if (randomX)
                x += (.3 - .6*Math.random())*dx;

            if (i === ny)
                y = h;
            else {
                y = (i + .5)*dy;

                if (randomY)
                    y += (.3 - .6*Math.random())*dy;
            }

            p[i].push([x, y, getOpacity(i, j, min, max)]);
        }
    }

    for (let i = 0; i < p.length; i++) {
        p[i] = [
            [p[i][p[i].length - 1][0] - w, p[i][p[i].length - 1][1], p[i][p[i].length - 1][2]],
            ...p[i],
            [p[i][0][0] + w, p[i][0][1], p[i][0][2]],
        ];
    }

    let pFirst: [number, number, number][] = [];
    let pLast = p[p.length - 1];

    for (let j = 0; j < pLast.length; j++)
        pFirst.push([pLast[j][0], pLast[j][1] - h, p[0][j][2]]);

    p.unshift(pFirst);

    for (let i = 1; i < p.length; i++) {
        for (let j = 1; j < p[i].length; j++) {
            fill.push(
                `<path opacity="${p[i][j][2]}" d="` +
                `M${p[i - 1][j - 1][0]},${p[i - 1][j - 1][1]} ` +
                `L${p[i - 1][j][0]},${p[i - 1][j][1]} ` + 
                `L${p[i][j][0]},${p[i][j][1]} ` + 
                `L${p[i][j - 1][0]},${p[i][j - 1][1]}z` +
                `"/>`,
            );
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" ` +
        `viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
        `<g stroke="none" fill="${color}">${fill.join('')}</g></svg>`;
}
