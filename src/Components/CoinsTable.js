import React, { useState, useEffect } from "react";
import axios from "axios";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { useNavigate } from "react-router-dom"
import { Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { numberWithCommas } from "./Banner/Carousel";

const CoinsTable = () => {
    const [coins, setCoins] = useState([]);
    // const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    // const [topic, setTopic] = useState("Cryptocurrency");
    const [page, setPage] = useState(1);
    const { currency, symbol } = CryptoState();
    const navigate = useNavigate();

    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        setCoins(data)
        setLoading(false);
    }
    // const fetchNews = async () => {
    //     setLoading(true);
    //     const { data } = await axios.get(CryptoNews(topic));
    //     setNews(data)
    //     setLoading(false);
    // }
    // console.log(coins);
    // console.log(news);
    useEffect(() => {
        fetchCoins();
    }, [currency]);

    // useEffect(() => {
    //     fetchNews();
    // }, [topic]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: "dark"
        }
    })

    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
        ))
    }
    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: "#16171a",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#131111"
            },
            fontFamily: "Montserrat"
        },
        pagination:{
            "& .MuiPaginationItem-root":{
                color:"gold"
            }
        }
    }));

    const classes = useStyles();

    return (
        <ThemeProvider theme={darkTheme}>
            <div style={{display:"flex"}}>
            <Container style={{ textAlign: "center",flex:"7"}}>
                <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }}>
                    Cryptocurrency Prices by Market Cap
                </Typography>
                <TextField label="Search for a Crypto Currency..." variant="outlined" style={{ marginBottom: 20, width: "100%" }} onChange={(e) => setSearch(e.target.value)} />
                <TableContainer>
                    {loading ? (<LinearProgress style={{ backgroundColor: "gold" }} />) : (
                        <Table>
                            <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                <TableRow>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                        <TableCell style={{ color: "black", fontWeight: "700", fontFamily: "Montserrat" }} key={head} align={head === "Coin" ? "left" : "right"}>
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                                    const profit = row.price_change_percentage_24h > 0;
                                    return (
                                        <TableRow onClick={() => navigate(`/coin/${row.id}`)} className={classes.row} key={row.name}>
                                            <TableCell component="th" scope="row" style={{ display: "flex", gap: 15 }}>
                                                <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ textTransform: "uppercase", fontSize: 22 }}>{row.symbol}</span>
                                                    <span style={{ color: "darkgray" }}>{row.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                {symbol}{""} {numberWithCommas(row.current_price.toFixed(2))}
                                            </TableCell>
                                            <TableCell align="right" style={{ color: profit > 0 ? "rgb(14,203,129)" : "red", fontWeight: 500 }}>
                                                {profit && "+"}
                                                {row.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                            <TableCell align="right">
                                                {symbol}{""}
                                                {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                <Pagination style={{padding:20,width:"100%",display:"flex",justifyContent:"center"}}
                classes={{ul:classes.pagination}}
                count={(handleSearch()?.length/10).toFixed(0)}
                onChange={(_,value)=>{
                    setPage(value);
                    window.scroll(0,450);
                }}/>
            </Container>
            <Container style={{textAlign: "center",flex:"3"}}>
            <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }}>
                Cryptocurrency News
            </Typography>
            <TextField label="Search for News..." variant="outlined" style={{ marginBottom: 20, width: "100%" }}
            //  onChange={(e) => setTopic(e.target.value)}
              />
            </Container>
            </div>
        </ThemeProvider>
    )
}
export default CoinsTable;