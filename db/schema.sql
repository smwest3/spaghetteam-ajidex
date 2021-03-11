create database ajidex-db

use ajidex-db

create table Users (
    UserID int identity(1,1) primary key,
    UserEmail varchar(80) NOT NULL,
    UserPassHash char(60) not null,
    UserName varchar(80) not null,
);

create table Restriction (
    RestrictionID int identity(1,1) primary key,
    RestrictionName varchar(80) NOT NULL,
    RestrictionDescr varchar(255),
);

create table UserRestriction (
    UserRestrictionID int identity(1,1) primary key,
    UserID int foreign key references Users(UserID) NOT NULL,
    RestrictionID int foreign key references Restriction(RestrictionID) NOT NULL
);

create table IngredientType (
    IngredientTypeID int identity(1,1) primary key,
    IngredientTypeName varchar(80) NOT NULL
);

create table Ingredient (
    IngredientID int identity(1,1) primary key,
    IngredientName varchar(80) NOT NULL,
    IngredientDescr varchar(255),
    IngredientTypeID int foreign key references IngredientType(IngredientTypeID) NOT NULL
)

create table IngredientRestriction (
    IngredientRestrictionID int identity(1,1) primary key,
    IngredientID int foreign key references Ingredient(IngredientID),
    RestrictionID int foreign key references Restriction(RestrictionID)
);

create table Allergen (
    AllergenID int identity(1,1) primary key,
    AllergenName varchar(80) NOT NULL,
    AllergenDescr varchar(255)
);

create table IngredientAllergen (
    IngredientAllergenID int identity(1,1) primary key,
    IngredientID int foreign key references Ingredient(IngredientID) NOT NULL,
    AllergenID int foreign key references Allergen(AllergenID) NOT NULL
);

create table Restaurant (
    RestaurantID int identity(1,1) primary key,
    RestaurantName varchar(100) NOT NULL,
    RestaurantAddress varchar(80) NOT NULL,
    RestaurantCity varchar(80) NOT NULL,
    RestaurantState varchar(20) NOT NULL,
    RestaurantZip int NOT NULL,
    RestaurantImg nvarchar(500)
    /*RestaurantWiFi, [type] NOT NULL*/
)

create table MealType (
    MealTypeID int identity(1,1) primary key,
    MealTypeName varchar(80) NOT NULL
)

create table Meal (
    MealID int identity(1,1) primary key,
    MealName varchar(80) NOT NULL,
    MealDescr varchar(255) NOT NULL,
    MealCal int NOT NULL,
    MealPrice numeric(4,2) NOT NULL,
    MealImg nvarchar(500),
    RestaurantID int foreign key references Restaurant(RestaurantID),
    MealTypeID int foreign key references MealType(MealTypeID)
);

create table MealIngredient (
    MealIngredientID int identity (1,1) primary key,
    MealID int foreign key references Meal(MealID),
    IngredientID int references Ingredient(IngredientID)
);

create table Texture (
    TextureID int identity(1,1) primary key,
    TextureName varchar(80) NOT NULL,
    TextureDescr varchar(255) NOT NULL
);

create table MealTexture (
    MealTextureID int identity(1,1) primary key,
    TextureID int foreign key references Texture(TextureID),
    MealID int foreign key references Meal(MealID)
) 

create table RestaurantCategory (
    RestaurantCategoryID int identity(1,1) primary key,
    RestaurantCategoryName varchar(80) not null,
    RestaurantCategoryDescr varchar(255)
);

create table RestaurantCategories (
    RestaurantCategoriesID int identity(1,1) primary key,
    RestaurantCategoryID int foreign key references RestaurantCategory(RestaurantCategoryID),
    RestaurantID int foreign key References Restaurant(RestaurantID)
);

--EVERYTHING BELOW THIS LINE R MY ADDITIONS TO THE CODE

/*Sprocs*/

--this is the more complicated one that i honestly don't think i need? like how does this differ from the one below, conceptually/in practice vv
create procedure getTextureID
@TextyName varchar(80),
@TextyDescr varchar(255),
@TextyID int output

as
set @TextyID = (select TextureID
		from Texture T
		where T.TextureName = @TextyName
		and T.TextureDescr = @TextyDescr
		)

create procedure uspPopRestaurantTexture
@TName varchar(80),
@TDescr varchar(255),

as
declare @TextyID2 int

exec getTextureID
@TextyName = @TName
@TextyDescr = @TDescr
@TextyID = @TextyID2 output

if @TextyID2 is null
	begin
		raiserror('@TextyID2 cant be null, dudes', 1,1)
		return
	end

begin tran t1
insert into Texture(TextureID)
values(@TextyID2)
if @@error <> 0
	begin
		rollback tran t1
	end
else
	commit tran t1



	--this is the more simple one: 

CREATE PROCEDURE uspPopTexture
@TextName varchar(80),
@TextDescr varchar(255)

AS
IF @TextName IS NULL
		BEGIN
			PRINT '@TextName  cannot be NULL, please give it a value.'
			RAISERROR ('@TextName cannot be NULL; check spelling', 11,1)
			RETURN
		END

IF @TextDescr IS NULL
		BEGIN
			PRINT '@TextDescr  cannot be NULL, please give it a value.'
			RAISERROR ('@TextDescr cannot be NULL; check spelling', 11,1)
			RETURN
		END

BEGIN TRANSACTION N2
INSERT INTO Texture(TextureName, TextureDescr)
VALUES (@TextName, @TextDescr)
IF @@ERROR <> 0
	BEGIN
		PRINT 'TRAN N2 is terminating due to an error. Good luck debugging!'
		ROLLBACK TRAN N2
	END
ELSE
COMMIT TRANSACTION N2





--sproc for adding allergens
CREATE PROCEDURE uspPopAllergens
@AllName varchar(80),
@AllDescr varchar(255)

AS
IF @AllName IS NULL
		BEGIN
			PRINT '@AllName  cannot be NULL, please give it a value.'
			RAISERROR ('@AllName cannot be NULL; check spelling', 11,1)
			RETURN
		END

IF @AllDescr IS NULL
		BEGIN
			PRINT '@AllDescr  cannot be NULL, please give it a value.'
			RAISERROR ('@AllDescr cannot be NULL; check spelling', 11,1)
			RETURN
		END

BEGIN TRANSACTION N3
INSERT INTO Allergen(AllergenName, AllergenDescription)
VALUES (@AllName, @AllDescr)
IF @@ERROR <> 0
	BEGIN
		PRINT 'TRAN N3 is terminating due to an error. Good luck debugging!'
		ROLLBACK TRAN N3
	END
ELSE
COMMIT TRANSACTION N3






--sproc for adding a new category (general)

CREATE PROCEDURE uspPopCategory
@AllName varchar(80),
@AllDescr varchar(255)

AS
IF @AllName IS NULL
		BEGIN
			PRINT '@AllName  cannot be NULL, please give it a value.'
			RAISERROR ('@AllName cannot be NULL; check spelling', 11,1)
			RETURN
		END

IF @AllDescr IS NULL
		BEGIN
			PRINT '@AllDescr  cannot be NULL, please give it a value.'
			RAISERROR ('@AllDescr cannot be NULL; check spelling', 11,1)
			RETURN
		END

BEGIN TRANSACTION N3
INSERT INTO Allergen(AllergenName, AllergenDescription)
VALUES (@AllName, @AllDescr)
IF @@ERROR <> 0
	BEGIN
		PRINT 'TRAN N3 is terminating due to an error. Good luck debugging!'
		ROLLBACK TRAN N3
	END
ELSE
COMMIT TRANSACTION N3






