import React from "react";
import {RestV1} from "../RestV1/RestV1";
import {
    Button, Select, TextField,
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';



export type Point = {
    country: string
    zipcode: string
}

export type DistanceResult = {
    distance: number
    time: number
}
//1
export type Error = {
    error: string
}

type Props = {};
type State = {
    originPoint: Point;
    destinationPoint: Point;
    distanceResult: DistanceResult | null;
    errorResult: Error | null;
    isLoading: boolean;
};

export class MainPage extends React.Component<Props, State> {
    private static state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            originPoint: {
                country: "",
                zipcode: ""
            },
            destinationPoint: {
                country: "",
                zipcode: ""
            },
            distanceResult: null,
            isLoading: false,
            errorResult: null
        };

        this.handleOriginZipcodeChange = this.handleOriginZipcodeChange.bind(this);
        this.handleDestinationPointChange = this.handleDestinationPointChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleOriginCountryChange = this.handleOriginCountryChange.bind(this);
        this.handleDestinationCountryChange = this.handleDestinationCountryChange.bind(this);
    }

    handleOriginZipcodeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const originPoint = this.state.originPoint;
        originPoint.zipcode = event.target.value;

        this.setState({originPoint: originPoint});
    }

    handleDestinationPointChange(event: React.ChangeEvent<HTMLInputElement>) {
        const destinationPoint = this.state.destinationPoint;
        destinationPoint.zipcode = event.target.value;

        this.setState({destinationPoint: destinationPoint})
    }

    handleOriginCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const originPoint = this.state.originPoint;
        originPoint.country = event.target.value;

        this.setState({originPoint: originPoint});
    }

    handleDestinationCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const destinationPoint = this.state.destinationPoint;
        destinationPoint.country = event.target.value;
        this.setState({destinationPoint: destinationPoint});
    }

    async handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isLoading: true});

        const result = await RestV1.getRouteDistance(this.state.originPoint, this.state.destinationPoint);

        this.setState({isLoading: false});

        if (result.success)
            this.setState({distanceResult: result.data, errorResult: null});
        else
            this.setState({errorResult: result.error.description, distanceResult: null});
    }

    render() {
        console.log(this.state);

        return (
            <div className="container">
                <h3 className="w-100 text-center mb-2">RouteDistance API</h3>
                <Paper className="p-2">
                    <div className="row mb-3">
                        <div className="col-md-3"/>
                        <div className="col-md-3">
                            <Select
                                native
                                //value={state.age}
                                onChange={this.handleOriginCountryChange}
                                className="w-100"
                            >
                                <option aria-label="None" value="">Choose a country</option>
                                <option value={"DK"}>Denmark</option>
                                <option value={"PL"}>Poland</option>
                            </Select>
                        </div>
                        <div className="col-md-3">
                            <Select
                                native
                                //value={state.age}
                                onChange={this.handleDestinationCountryChange}
                                className="w-100"
                            >
                                <option aria-label="None" value="">Choose a country</option>
                                <option value={"DK"}>Denmark</option>
                                <option value={"PL"}>Poland</option>
                            </Select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3"/>
                        <div className="col-md-3">
                            <TextField
                                style={{display: "block", width: "100%!important"}}
                                type="text"
                                placeholder="origin zip code"
                                onChange={this.handleOriginZipcodeChange}
                                value={this.state.originPoint.zipcode}
                            /></div>
                        <div className="col-md-3">
                            <TextField
                                style={{display: "block", width: "100%!important"}}
                                className="w-100"
                                type="text"
                                placeholder="destination zip code"
                                onChange={this.handleDestinationPointChange}
                                value={this.state.destinationPoint.zipcode}
                            /></div>
                    </div>
                    <div className="row">
                        <div className="col-md-3"/>
                        <div className="col-md-6 text-center">
                            <Button onClick={this.handleClick}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<SearchIcon/>}
                            >
                                Search
                            </Button>
                        </div>
                    </div>

                    {
                        this.state.isLoading ? (
                            <div className="row my-3">
                                <div className="col-md-12">
                                    <div className="p-3 text-center">
                                        <CircularProgress />
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }


                    {
                        this.state.distanceResult ? (
                            <div className="col-lg-md-12 my-3">
                                {/*<div className="row-md-12">*/}
                                    <Paper className="p-3 text-center" elevation={3}>
                                        <div>
                                            <b>Distance:</b> {this.state.distanceResult.distance.toFixed(2)} kilometers <br/>
                                            <b>Time:</b> {this.state.distanceResult.time.toFixed(2)} minutes.
                                        </div>
                                    </Paper>
                                {/*</div>*/}
                             </div>
                        ) : null
                    }

                    {
                        this.state.errorResult ? (
                            <div className="row my-3 ">
                                <div className="col-md-12">
                                    <Paper className="p-3 text-center text-danger" elevation={3}>
                                        <div>
                                            {
                                                this.state.errorResult
                                            }
                                        </div>
                                    </Paper>
                                </div>
                            </div>
                        ) : null
                    }
                </Paper>
            </div>
        );
    }
}
