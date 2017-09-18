const path=require('path');
// const webpack=require('webpack');
module.exports={
    entry:'./src/index.js',
    output:{
        path:__dirname,
        // path:path.resolve(__dirname,'./dist'),
        filename:'./dist/bundle.js'
    },
    module:{
        loaders:[
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                query:{
                    presets:['es2015','react']
                }
            },
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'
            },
            {
                test:/\.less$/,
                loader:'style-loader!css-loader!less-loader'
            }
        ]
    }
}