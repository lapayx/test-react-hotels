import React, { useEffect, useReducer, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import HotelCard from "./components/HotelCard";
import { useCallback } from "react";

const initSate = { hotels: {}, generalInfoIsLoaded: false };

const actionTypeLoadData = "loadData";
const actionTypeLoadDataRooms = "loadDataRooms";


function reducer(state, action) {
    const actions = {
        [actionTypeLoadData]: function (state, data) {
            const hotels = {};
            for (const h of data) {
                hotels[h.id] = { ...h, rooms: [] };
            }
            return { ...state, hotels, generalInfoIsLoaded: true };
        },
        [actionTypeLoadDataRooms]: function (state, data) {
            let newHotels = { ...state.hotels };
            if (!!newHotels[data.hotelId]) {
                newHotels[data.hotelId].rooms = data.data.rooms;
            }
            return { ...state, hotels: newHotels };
        },
    };

    if (actions[action.type]) {
        return actions[action.type](state, action.data);
    }
    return state;
}


export default function () {

    const [state, dispatch] = useReducer(reducer, initSate);
    const [filter, setFilter] = useState({ starRating: 0, maxAdults: 2, maxChildren: 0 });

    useEffect(() => {
        fetch("https://obmng.dbm.guestline.net/api/hotels?collection-id=OBMNG")
            .then((data) => data.json())
            .then((data) => dispatch({ type: actionTypeLoadData, data }));
    }, []);

    useEffect(() => {
        if (state.generalInfoIsLoaded) {
            for (let h of Object.keys(state.hotels)) {
                fetch("https://obmng.dbm.guestline.net/api/roomRates/OBMNG/" + h)
                    .then((data) => data.json())
                    .then((data) =>
                        dispatch({
                            type: actionTypeLoadDataRooms,
                            data: { data, hotelId: h },
                        })
                    );
            }
        }
    }, [state.generalInfoIsLoaded]);

    const handleChangeFilter = useCallback((e) => {
        const { name, value } = e.target;
        setFilter((x) => {
            return { ...x, [name]: value };
        });
    }, []);

    const getData = function () {
        let ress = [];
        for (const h of Object.values(state.hotels)) {
            if (h.starRating < filter.starRating) {
                continue;
            }
            const fh = { ...h };
            fh.rooms = h.rooms.filter(
                (x) =>
                    x.occupancy.maxAdults >= filter.maxAdults &&
                    x.occupancy.maxChildren >= filter.maxChildren
            );
            if (!fh.rooms.length) {
                continue;
            }
            ress.push(fh);
        }
        return ress;
    };
    return (
        <Container>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Star Rating</Form.Label>
                        <Form.Select
                            value={filter.starRating}
                            onChange={handleChangeFilter}
                            name={"starRating"}>
                            <option value="0">All</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Adult</Form.Label>
                        <Form.Select
                            value={filter.maxAdults}
                            onChange={handleChangeFilter}
                            name={"maxAdults"}>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Children</Form.Label>
                        <Form.Select
                            value={filter.maxChildren}
                            onChange={handleChangeFilter}
                            name={"maxChildren"}>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    {getData().map((x) => {
                        return <HotelCard key={x.id} data={x} />;
                    })}
                </Col>
            </Row>
        </Container>
    );
}
