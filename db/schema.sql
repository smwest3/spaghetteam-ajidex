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