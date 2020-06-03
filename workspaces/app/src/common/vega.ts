import * as Vega from 'vega'

import { MY_LIGHT_THEME } from './myTheme'

// tslint:disable: object-literal-sort-keys naming-convention
export const vegaSpecHeatmap: Vega.Spec = {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: MY_LIGHT_THEME.shape.boxWidth,
    height: MY_LIGHT_THEME.shape.boxHeight * 3,
    padding: 0,

    signals: [
        {
            name: 'yMaxGlobal',
            init: 'data(\'max\')[0].y',
        },
        {
            name: 'xMaxGlobal',
            init: 'data(\'max\')[0].x',
        },
        {
            name: 'yMaxLocal',
            init: 'length(data(\'integrity0\'))',
        },
        {
            name: 'xMaxLocal',
            init: 'length(data(\'integrity0\')[0].data)',
        },
        {
            name: 'xdomain',
            init: 'sequence(0, xMaxGlobal)',
        },
        {
            name: 'ydomain',
            init: 'sequence(0, yMaxGlobal)',
        },
        {
            name: 'vdomain',
            init: '[0, data(\'max\')[0].value]',
        },
    ],
    data: [
        {
            name: 'integrity0',
            values: [],
            transform: [
                {type: 'identifier', as: 'y'},
                {type: 'formula', as: 'y', expr: 'datum.y - 1'},
                {type: 'formula', as: 'x', expr: 'sequence(0, length(datum.data))'},
            ],
        },
        {
            name: 'integrity',
            source: 'integrity0',
            transform: [
                {type: 'flatten', fields: ['data', 'x']},
                {type: 'project', fields: ['data', 'x', 'y'], as: ['value']},
                {type: 'filter', expr: 'datum.value > 0'},
                {type: 'formula', as: 'weight', expr: 'pow(datum.value, 1/2)'},
                {type: 'formula', as: 'x', expr: 'datum.x + round((xMaxGlobal - xMaxLocal)/2)'},
                {type: 'formula', as: 'y', expr: 'datum.y + round((yMaxGlobal - yMaxLocal)/2)'},
            ],
        },
        {
            name: 'max',
            values: [],
        },
    ],

    scales: [
        {
            name: 'x',
            type: 'band',
            domain: {signal: 'xdomain'},
            range: 'width',
        },
        {
            name: 'y',
            type: 'band',
            domain: {signal: 'ydomain'},
            range: 'height',
        },
        {
            name: 'color',
            type: 'linear',
            range: {scheme: 'Magma'},
            domain: {signal: 'vdomain'},
            reverse: true,
            zero: true,
            nice: false,
        },
    ],

    marks: [
        {
            type: 'rect',
            from: {data: 'integrity'},
            encode: {
                enter: {
                    x: {scale: 'x', field: 'x'},
                    y: {scale: 'y', field: 'y'},
                    width: {scale: 'x', band: 1},
                    height: {scale: 'y', band: 1},
                    tooltip: {signal: '\'(\' + datum.x + \', \' + datum.y + \'): \' + round(datum.value) + \'\''},
                },
                update: {
                    fill: {scale: 'color', field: 'weight'},
                },
            },
        },
    ],
}

export const vegaSpecHeatmapLegend: Vega.Spec = {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: MY_LIGHT_THEME.shape.boxWidth * 1 - 40,
    height: MY_LIGHT_THEME.shape.boxHeight * 1 - 44,
    padding: {
        left: 20,
        top: 0,
        right: 20,
        bottom: 0,
    },
    signals: [
        {
            name: 'domain',
            description: 'A date value that updates in response to mousemove.',
            init: 'data(\'domain\')[0].max',
        },
    ],
    data: [
        {
            name: 'domain',
            values: [
                {max: 1000},
            ],
        },
    ],
    scales: [
        {
                name: 'color',
                type: 'linear',
                range: {scheme: 'Magma'},
                domain: [0, {signal: 'domain'}],
                domainMax: {signal: 'domain'},
                domainMin: 0,
                reverse: true,
                zero: true,
                nice: false,
        },
    ],
    legends: [
        {
            type: 'gradient',
            direction: 'horizontal',
            orient: 'bottom',
            fill: 'color',
            tickCount: 5,
            gradientLength: {
                signal: 'width',
            },
            encode: {
                legend: {
                    enter: {
                        x: {value: 0},
                        y: {value: 0},
                    },
                },
                labels: {
                    enter: {
                        dx: {value: 0},
                        dy: {value: -28},
                    },
                    update: {
                        align: {value: 'center'},
                        baseline: {value: 'middle'},
                        text: {
                            // tslint:disable-next-line: max-line-length
                            signal: 'pow(datum.value, 2) < 1000 ? pow(datum.value, 2) + \'\u00A0\u00A0\'  : pow(datum.value, 2) < 1000000 ? floor(pow(datum.value, 2)/1000) + \'k\' : floor(pow(datum.value, 2)/1000000) + \'m\'',
                        },
                    },
                },
            },
        },
    ],
}
