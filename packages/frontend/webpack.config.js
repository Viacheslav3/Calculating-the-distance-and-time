const {join} = require("path");
const {readFileSync} = require("fs");

const tsconfig = JSON.parse(readFileSync("./tsconfig.json").toString());

function isDeployment()
{
    let argv = process.argv;
    for(let i = 0; i < argv.length; i++)
    {
        if(argv[i] === '-debug' || argv[i] === '--debug')
            return false;
    }
    return true;
}

function isLite()
{
    let argv = process.argv;
    for(let i = 0; i < argv.length; i++)
    {
        if(argv[i] === '-lite' || argv[i] === '--lite')
            return true;
    }
    return false;
}

const IS_DEPLOYMENT = isDeployment();
const IS_LITE = isLite();

module.exports = {
    mode : IS_DEPLOYMENT ? 'production' : 'development',
    devtool : IS_DEPLOYMENT ? undefined : IS_LITE ? 'cheap-source-map' : 'source-map',
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    module : {
        rules : [
            {
                test : /\.(scss|sass|css)$/i,
                use : [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader : 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader : 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader : 'postcss-loader',
                        options : {
                            plugins : function()
                            {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader : 'sass-loader'
                    }
                ]
            },
            {
                test : /(\.tsx?)|(\.jsx?)$/,
                include: [
                    join(__dirname, 'src')
                ],
                exclude : [
                    join(__dirname, "../../node_modules"),
                    join(__dirname, "node_modules")
                ],
                use : [
                    {loader: 'cache-loader'},
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                ...tsconfig.compilerOptions,
                                sourceMap: !IS_DEPLOYMENT && !IS_LITE,
                            },
                            transpileOnly: IS_LITE,
                            experimentalWatchApi: true,
                        }
                    }
                ]
            },
            {
                test : /\.(woff|woff2|ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader : 'url-loader'
            }
        ]
    },
    resolve : {
        extensions : [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.scss'
        ]
    },
    entry : {
        main : './src/apps/main'
    },
    output : {
        filename : '[name].min.js',
        path : __dirname + '/../../public/javascripts/',
        pathinfo: false
    },
    plugins : []
};