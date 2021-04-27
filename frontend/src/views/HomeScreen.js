import React from 'react';
import { Jumbotron, Row, Col, Image, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
	return (
		<div className='home'>
			<Image
				src='images/events2.jpg'
				alt='Header Image'
				width='100%'
				style={{ marginBottom: '2%' }}
			></Image>

			<Container>
				<Row>
					<Col className='text-center' sm={12}>
						<h1>Events at your fingertips</h1>
						<p>
							Eventify connects buisinesses and event hosts to
							their audience with ease through seamless ticket
							checkouts and real-time booking. We offer events
							from a wide range of categories including Education,
							Technology, Music Concerts and many more!
						</p>
					</Col>
				</Row>
				<br />
				<Row>
					<Col className='text-center' sm={12} md={5}>
						<LinkContainer to='/login?redirect=createEvent'>
							<Button>
								Let us help you create your event{' '}
								<i className='fas fa-arrow-right'></i>
							</Button>
						</LinkContainer>
					</Col>
					<Col className='text-center' sm={12} md={2}>
						<h1>OR</h1>
					</Col>
					<Col className='text-center' sm={12} md={5}>
						<LinkContainer to='/events'>
							<Button>
								Explore Events{' '}
								<i className='fas fa-arrow-right'></i>
							</Button>
						</LinkContainer>
					</Col>
				</Row>
				<br />
				<br />
				<Row className='text-center'>
					<Col sm={12} md={6}>
						<h2>Host local events in your area</h2>
						<p>
							Eventify makes it easy for people in your
							city/country to view your locally hosted events and
							join the fun!
						</p>
					</Col>
					<Col sm={12} md={6}>
						<h2>..Or Host them virtually!</h2>
						<p>
							Eventify also allows their event hosts to live
							stream their event (Only to those who bought the
							tickets ofcourse!) to allow participants from all
							over the world to join and enjoy!
						</p>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default HomeScreen;
