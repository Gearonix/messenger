// import classes from "../../messages/messages.module.css";
import classes from "./helpers.module.css";
import {Button} from "antd";
import {DownloadOutlined, UploadOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {includeImage,catchFile} from "../../../tools";

export const FileButton = function({change,svg_color='white'} : {change : Function,svg_color ?: string}){
    return (
        <div className={classes.backgroundBlock}>
            {/*<Button style={{*/}
            {/*    // height: '100%', width: '90%', margin: '0 auto', display: 'block', fontSize: 20,*/}
            {/*// }}>*/}
                <UploadOutlined style={{fontSize: 50,color : svg_color}}/>
            {/*</Button>*/}
            {/*@ts-ignore*/}
            <input onChange={change} type={'file'} className={classes.inputFile}/>
            {/*@ts-ignore*/}
            <input onChange={change} type={'file'} className={classes.anotherFile}/>
            {/*@ts-ignore*/}
            <input onChange={change} type={'file'} className={classes.middleFile}/>
        </div>
    )
}
