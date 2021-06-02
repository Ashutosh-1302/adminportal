import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Edit, Flag, Link, LocationOn } from "@material-ui/icons";
import React, { useState } from "react";
import { AddForm } from "./events-props/add-form";
import { EditForm } from "./events-props/edit-form";
import { useSession } from "next-auth/client";
import Filter from "./common-props/filter";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		boxSizing: `border-box`,
	},
	paper: {
		margin: `${theme.spacing(1)}px auto`,
		padding: `${theme.spacing(1.5)}px`,
		lineHeight: 1.5,
	},
	truncate: {
		display: `block`,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: `nowrap`,
	},
	icon: {
		display: `block`,
		fontSize: `2rem`,
		marginLeft: `auto`,
		marginRight: `auto`,
	},
	attached: {
		"& > span": { paddingLeft: `8px` },
		"& > span:first-child": {
			paddingLeft: 0,
		},
	},
}));

const DataDisplay = (props) => {
	const [session, loading] = useSession();
	const classes = useStyles();
	const [details, setDetails] = useState(props.data);

	const [addModal, setAddModal] = useState(false);
	const addModalOpen = () => {
		setAddModal(true);
	};
	const handleCloseAddModal = () => {
		setAddModal(false);
	};

	const Event = ({ detail }) => {
		let openDate = new Date(detail.timestamp);
		let dd = openDate.getDate();
		let mm = openDate.getMonth() + 1;
		let yyyy = openDate.getFullYear();
		openDate = dd + "/" + mm + "/" + yyyy;
		const [event_link, setEvent_link] = useState(JSON.parse(detail.event_link));

		const [editModal, setEditModal] = useState(false);

		const editModalOpen = () => {
			setEditModal(true);
		};

		const handleCloseEditModal = () => {
			setEditModal(false);
		};

		return (
			<React.Fragment key={detail.id}>
				<Grid item xs={12} sm={8} lg={10}>
					<Paper
						className={classes.paper}
						style={{ minHeight: `50px`, position: `relative` }}
					>
						<span className={classes.truncate}>{detail.title}</span>
						<div className={classes.attached}>
							{event_link && (
								<span
									style={{
										display: `inline-flex`,
										margin: `5px 0 `,
									}}
								>
									<Flag color="secondary" />
									<a href={event_link.url} target="_blank">
										{event_link.caption}
									</a>
								</span>
							)}

							{detail.attachments &&
								detail.attachments.map((attachment, idx) => {
									return (
										<span
											key={idx}
											style={{
												display: `inline-flex`,
												margin: `5px 0 `,
											}}
										>
											<Flag />
											<a href={attachment.url} target="_blank">
												{attachment.caption}
											</a>
										</span>
									);
								})}
							<span
								style={{
									display: `inline-flex`,
									margin: `5px 0 `,
								}}
							>
								<LocationOn color="secondary" />
								{detail.venue}
							</span>
						</div>

						<span
							style={{
								position: `absolute`,
								right: `12px`,
								bottom: `12px`,
							}}
						>
							{openDate}
						</span>
					</Paper>
				</Grid>

				<Grid item xs={6} sm={2} lg={1}>
					<Paper className={classes.paper} style={{ textAlign: `center` }}>
						<a href={detail.doclink} style={{ textDecoration: `none` }}>
							<Link className={classes.icon} />
							<span>Event Attach/Link</span>
						</a>
					</Paper>{" "}
				</Grid>
				{session.user.role == 1 || session.user.email === detail.email ? (
					<Grid item xs={6} sm={2} lg={1}>
						<Paper
							className={classes.paper}
							style={{ textAlign: `center`, cursor: `pointer` }}
							onClick={editModalOpen}
						>
							<Edit className={classes.icon} /> <span>Edit</span>
						</Paper>{" "}
						<EditForm
							data={detail}
							modal={editModal}
							handleClose={handleCloseEditModal}
						/>
					</Grid>
				) : (
					<Grid item xs={6} sm={2} lg={1}>
						<Paper
							className={classes.paper}
							style={{ textAlign: `center`, cursor: `pointer` }}
						>
							Not Authorized
						</Paper>{" "}
					</Grid>
				)}
			</React.Fragment>
		);
	};

	return (
		<div>
			<header>
				<Typography variant="h4" style={{ margin: `15px 0` }}>
					Recent Events
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={addModalOpen}
					style={{ display: "inline" }}
				>
					ADD +
				</Button>
				<Filter type="events" setEntries={setDetails} />
			</header>

			<AddForm handleClose={handleCloseAddModal} modal={addModal} />

			<Grid container spacing={2} className={classes.root}>
				{details.map((detail) => {
					return <Event detail={detail} />;
				})}
				{/* <Grid >
            <Paper xs={12} sm={9}>{detail.title}</Paper>
         </Grid> */}
			</Grid>
		</div>
	);
};

export default DataDisplay;
