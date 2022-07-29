import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import AttachmentService from "../../services/attachment.service";
import '../../styles/Record.css'
import {Grid, Paper, Tooltip, withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {purple} from "@material-ui/core/colors";
import {Link} from "react-router-dom";

const useStyles = theme => ({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: purple[500],
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#11cb5f',
        },
        textPrimary: {
            main: "#1B435D",
        }
    },
    gridCreatorName: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        "& .MuiTypography-root": {
            color: "black",
        },

    },
    grid: {
        "& .MuiTypography-root": {
            color: "black",
        },
        margin: theme.spacing(1.5, 0, 0, 1),
    },
    ggrid: {
        margin: theme.spacing(0, 0, 0, 1),
        display: 'flex',

    },
    gridContent: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]:{
            width: 209,
        },
        [theme.breakpoints.between("sm", "md")]:{
            width:620
        },
        "@media (min-width : 1280px)":{
           width: 1000,
        },
    },
    paper: {
        padding: theme.spacing(2),
        //marginLeft: theme.spacing(1),
        // maxWidth: 700,
        borderColor: "#e9e9e9",
        borderRadius: 10,
        /*alignItems:"center",
        display:"flex",*/
        [theme.breakpoints.down("xs")]:{
            width: 270,
        },
        [theme.breakpoints.between("sm", "md")]:{
            width:650
        },
        "@media (min-width : 1280px)":{
            width: 800,
        },
    },
    mainGrid: {
        margin: 0,
    },
    tagsColor: {
        color: "#6d6d6d",
    },
    content: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        [theme.breakpoints.down("xs")]:{
            width: 240,
        },
        [theme.breakpoints.between("sm", "md")]:{
            width:620
        },
        "@media (min-width : 1280px)":{
            width: 770,
        },
    },
    titleStyle: {
        size: 15,
    },
    buttons: {
        width: 300,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
})

class RecordCardNew extends Component {
    constructor(props) {
        super(props);

        this.download = this.download.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.getContent = this.getContent.bind(this);
        this.displayRecordThread = this.displayRecordThread.bind(this);
        this.openDicomViewer = this.openDicomViewer.bind(this);
        this.getOffsetBetweenTimezonesForDate = this.getOffsetBetweenTimezonesForDate.bind(this);
        this.convertDateToAnotherTimeZone = this.convertDateToAnotherTimeZone.bind(this);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            filePreviews: [],
            dicoms: [],
        };

        this.record = this.props.record;
        this.isPreview = this.props.isPreview;
        this.isReply = this.props.isReply;
        this.creationTime = this.formatTime();
    }

    getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
        const timezone1Date = this.convertDateToAnotherTimeZone(date, timezone1);
        const timezone2Date = this.convertDateToAnotherTimeZone(date, timezone2);
        return timezone1Date.getTime() - timezone2Date.getTime();
    }

    convertDateToAnotherTimeZone(date, timezone) {
        const dateString = date.toLocaleString('en-US', {
            timeZone: timezone
        });
        return new Date(dateString);
    }

    getContent(content) {
        if (this.props.isPreview && content != null && content.length > 1000) {
            return content.substring(0, 1000) + '...';
        }
        return content;
    }

    formatTime() {
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = this.getOffsetBetweenTimezonesForDate(new Date(), this.record.timeZone, timeZone)
        return (new Date(new Date(this.record.creationTime).getTime() - difsTimeZones))
    }

    displayRecordThread() {
        this.props.history.push({
            pathname: '/records/thread/' + this.record.id,
            state: {recordId: this.record.id}
        });
        window.location.reload();
    }

    componentDidMount() {
        let preview = [];
        let dicom = [];
        if (this.record.attachments !== undefined && this.record.attachments !== null) {
            for (let i = 0; i < this.record.attachments.length; i++) {
                if (this.record.attachments[i].initialName.endsWith(".jpg") ||
                    this.record.attachments[i].initialName.endsWith(".png") ||
                    this.record.attachments[i].initialName.endsWith(".dcm")) {
                    AttachmentService.getPreviewNew(this.record.attachments[i].id).then(response => {
                        dicom.push(response.data)
                        preview.push({id: this.record.attachments[i].id, image: URL.createObjectURL(response.data)});
                        this.setState({filePreviews: preview, dicoms: dicom}
                        )
                        ;
                    }).catch(error => {
                        console.log(error);
                    })
                }
            }
        }
    }

    download(fileId, initialFileName) {
        AttachmentService.downloadAttachment(fileId, initialFileName);
    }

    endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    openDicomViewer(uid) {
        const url = window.location.href
        const num = url.indexOf(":7999")
        window.open(url.slice(0, num + 1) + "3000/viewer/" + uid, '_blank')
    }

    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.paper} variant="outlined">
                <Grid container item xs={12} sm direction={"column"} className={classes.mainGrid}>
                    <Grid container item className={classes.ggrid} xs direction={"row"} spacing={1}>
                        <Grid className={classes.gridCreatorName} title ={this.record.creator.username}>
                            <Link style={{color: "black"}} to={"/profile/" + this.record.creator.username}>
                                {this.record.creator.username}
                            </Link>
                        </Grid>
                        <Grid className={classes.ggrid}>
                            <Typography variant={"subtitle1"}>
                                {
                                    (((new Date(this.creationTime).getHours() < 10 && "0" + new Date(this.creationTime).getHours())
                                            || (new Date(this.creationTime).getHours() >= 10 && new Date(this.creationTime).getHours())) + ":"
                                        + ((new Date(this.creationTime).getMinutes() < 10 && "0" + new Date(this.creationTime).getMinutes())
                                            || (new Date(this.creationTime).getMinutes() > 10 && new Date(this.creationTime).getMinutes())
                                        )) + "    " + (
                                        ((new Date(this.creationTime).getDate() < 10 && "0" + new Date(this.creationTime).getDate()) || (new Date(this.creationTime).getDate() >= 10 && new Date(this.creationTime).getDate()))
                                        + "."
                                        + (((new Date(this.creationTime).getMonth() + 1) < 10 && "0" + (new Date(this.creationTime).getMonth() + 1)) || (((new Date(this.creationTime).getMonth() + 1) >= 10 && (new Date(this.creationTime).getMonth() + 1))))
                                        + "." + new Date(this.creationTime).getFullYear()
                                    )}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid className={classes.grid}>
                        {this.isPreview ? (
                            <Typography variant="h6" title={this.record.title}>{/*gutterBottom*/}
                                <Link style={{color: "black"}} to={"/records/thread/" + this.record.id}>
                                    {this.record.title}
                                </Link>
                            </Typography>
                        ) : (
                            <Typography variant="h6">{/*gutterBottom*/}
                                {this.record.title}
                            </Typography>)
                        }
                    </Grid>
                    <Grid className={classes.gridContent}>
                        <Typography variant="body1" className={classes.content}>{/*gutterBottom*/}
                            {this.getContent(this.record.content)}
                        </Typography>
                    </Grid>
                    <Grid className={classes.grid} container direction={"row"} spacing={1}>
                        {this.record.topics && this.record.topics.map(el => (
                            <Grid item key={el.id} color={"#616161"}>
                                <Typography className={classes.tagsColor}>
                                    {el.name}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>


                    {/*<div id={containerId} />*/}

                    {!this.isPreview && this.state.filePreviews.map((el, index) => (
                        // <Tooltip title="Открыть в DICOM Viewer">
                        //     <a href={"http://localhost:3000/viewer/" + this.record.attachments[index].uid} target="_blank">
                        //         <Button><img className="col-sm-8 top-buffer-10" key={el.id} alt="" src={el.image}>
                        //         </img>
                        //         </Button>
                        //
                        //     </a>
                        // </Tooltip>
                        <Tooltip title="Открыть в DICOM Viewer">
                            <img onClick={() => this.openDicomViewer(this.record.attachments[index].uid)}
                                 className="col-sm-8 top-buffer-10" key={el.id} alt="" src={el.image}
                                 style={{cursor: 'pointer'}}
                            >
                            </img>
                        </Tooltip>
                    ))}

                    {!this.isPreview && this.record.attachments.map(el => (
                        // <img key={el.id} alt="" className="col-sm-6 top-buffer-10" src={el.image} />
                        <div key={el.id} className="row top-buffer-10">
                            {/*<div className="col-sm-5">{el.initialName}</div>*/}
                            <div>
                                <button
                                    style={{marginLeft: "30px", borderStyle: "none"}}
                                    className="btn-sm btn-primary color-white"
                                    onClick={() => this.download(el.id, el.initialName)}>
                                    <i className="fa fa-download"> Скачать {el.initialName}</i>
                                </button>
                            </div>
                        </div>
                    ))}


                    {this.isPreview &&
                    <div className="col-sm-2 fa fa-comments"
                         style={{"float": "right"}}> {this.record.numberOfReplies}</div>
                    }


                </Grid>
            </Paper>
        );
    }
}

export default withStyles(useStyles)(RecordCardNew)