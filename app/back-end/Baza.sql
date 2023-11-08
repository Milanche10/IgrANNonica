CREATE DATABASE NeuronHorizon; 
CREATE TABLE Users(
	userID int primary key not null AUTO_INCREMENT,
	username varchar(50) not null UNIQUE, 
	pass varchar(50) not null,
	FirstName varchar(50) not null,
	LastName varchar(50) not null,
	email varchar(50) not null UNIQUE,
	confirmed tinyint not null
);

CREATE TABLE Experiments(
	experimentID int primary key not null AUTO_INCREMENT,
	userID int not null,
	experimentName varchar(30) not null,
	createDate date not null,
	statisticsPath varchar(100) not null,
	FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Models(
	modelID int primary key not null AUTO_INCREMENT,
	experimentID int not null,
	modelName varchar(30) not null,
	createDate date not null,
	filePath varchar(100) not null,
	statisticsPath varchar(100) not null, 
    FOREIGN KEY (experimentID) REFERENCES Experiments(experimentID)
);
