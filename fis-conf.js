var path = require('path');
//代码版本号
var version = '1.0.0';

fis.set('project.fileType.text', 'vue');
fis.set('project.files', ['src/**', 'public/**']);
fis.set('project.ignore', fis.get('project.ignore').concat(['output/**', 'DS_store']));

//commonjs模块化支持
fis.hook('commonjs', {
    baseUrl: '/',
    paths: {
        '@': 'src'
    },
    extList: ['.js', '.jsx', '.es', '.ts', '.tsx', '.vue']
});

// 禁用components
fis.unhook('components')
fis.hook('node_modules')

/**
 * 业务逻辑目录src
 * node_modules目录开启模块化支持和同名依赖
 */
fis.match('/{node_modules,src}/**.js', {
    isMod: true,
    useSameNameRequire: true
});

/**
 * babel es6=>es5
 */
fis.match('src/**.js', {
    rExt: 'js',
    // parser: fis.plugin('typescript')
    parser: fis.plugin('typescript', {
        module: 1,
        target: 1,
        sourceMap: false
    })
    // parser: fis.plugin('babel-5.x', {}, {
    //     presets: ["es2015", "stage-0"]
    // })
});

/**
 * less解析
 */
fis.match('**.{less,css}', {
    rExt: '.css',
    isCssLike: true,
    parser: fis.plugin('less'),
    // postprocessor: fis.plugin('autoprefixer')
});

/**
 * vue模块解析
 */
fis.match('src/**.vue', {
    // id: '$1',
    isMod: true,
    rExt: 'js',
    // isJsLike: true,
    useSameNameRequire: true,
    parser: fis.plugin('vue-component', {
        runtimeOnly: true,
    })
}).match('src/**.vue:js', {
    rExt: 'js',
    isMod: true,
    // parser: fis.plugin('typescript')
    parser: fis.plugin('typescript', {
        module: 1,
        target: 1,
        sourceMap: false
    })
}).match('src/**.vue:less', {
    rExt: 'css',
});


// 所有的文件产出到 output/ 目录下
fis.match('*', {
    release: '/assets/$0'
});

// 入口index.html发布到根目录
fis.match('public/(**)', {
    release: '/$1'
});



/**
 * 添加css和image模块化加载支持
 * import 'font-awesome.css' 或 require('font-awesome.css')
 */
// fis.match('**.{js,jsx,ts,es,vue}', {
//     preprocessor: [
//         fis.plugin('js-require-css'),
//         fis.plugin('js-require-file', {
//             useEmbedWhenSizeLessThan: 10 * 1024 // 小于10k用base64
//         })
//     ]
// });


/**
 * common/lib下资源不做解析
 */
fis.match('/common/lib/**.js', {
    isMod: false,
    parser: null
});

/**
 * 入口main.js不做AMD包装
 */
fis.match('/src/main.js', {
    isMod: false,
    parser: fis.plugin('babel-5.x')
});

/**
 * loader分析依赖并自动引入资源。
 */
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        // allInOne: false
    })
});

/**=====================================
 * 开发环境
 * 使用：npm run dev
 */
fis.media('dev')
    .match('**.{js,jsx,css,less}', {
        useHash: false
    })
    .match('**', {
        deploy: fis.plugin('local-deliver', {
            to: path.join(__dirname, './output')
        })
    });

/**=====================================
 * 生产环境css、js压缩合并
 * js、css、图片引用 URL 添加 md5 戳
 * 使用：npm run release
 */
fis.media('prod')
    .match('**.{js,jsx,css,less}', {
        useHash: true
    })
    .match('*.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('*.{css,less,styl}', {
        useSprite: true,
        optimizer: fis.plugin('clean-css')
    })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            // 配置是否合并零碎资源
            allInOne: {
                css: '/pkg/all.css',
                js: '/pkg/all.js'
                // includeAsyncs: true //是否包含异步依赖。
            },
            resourceType: 'mod',
            useInlineMap: true // 资源映射表内嵌
        })
    })
    .match('*.{css,less,js,png,jpg,gif}', { // 静态资源添加MD5戳
        useHash: true,
        // domain: ''
    })
    .match('**', {
        deploy: fis.plugin('local-deliver', {
            to: path.join(__dirname, './prod')
        })
    });
