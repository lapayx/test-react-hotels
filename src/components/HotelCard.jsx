import React from "react";
import { Row, Col, ListGroup, Carousel } from "react-bootstrap";
import RoomCard from "./RoomCard";

export default function ({ data }) {
    return (
        <ListGroup className="mb-3">
            <ListGroup.Item>
                <Row col={3}>
                    <Col xs={3}>
                        <Carousel variant="dark h-100">
                            {data.images.map((x) => (
                                <Carousel.Item>
                                    <img
                                        classname="rounded mx-auto d-block"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                        src={x.url}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                    <Col>
                        <h3>{data.name}</h3>
                        <p>
                            <strong>Address 1: </strong>
                            {data.address1}
                        </p>
                        <p>
                            <strong>Address 2: </strong>
                            {data.address2}
                        </p>
                    </Col>
                    <Col xs={3}>
                        Stars : <strong>{data.starRating}</strong>
                    </Col>
                </Row>
            </ListGroup.Item>
            {data.rooms.map((x) => (
                <ListGroup.Item key={x.name}>
                    <RoomCard data={x} />
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
