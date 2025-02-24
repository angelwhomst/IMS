-- get all products
create view vw_get_all_products
as 
select 
	p.productName, 
	p.productDescription,
	p.size, 
	p.unitPrice,
	count(pv.variantID) as 'available quantity', 
	p.currentStock,
	p.reorderLevel, 
	p.minStockLevel, 
	p.maxStockLevel, 
	p.threshold,
	cast(p.image_path as varchar(max)) as image_path
from products as p
left join ProductVariants as pv
	on p.productID = pv.productID and pv.isAvailable =1 --pv.isAvailable = 1 inside the ON condition so that the left join still returns NULL rows when no available variants exist
where p.isActive = 1 
group by 
	p.productName, p.productDescription, p.size, p.unitPrice, p.warehouseID, p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.currentStock, p.threshold, cast(p.image_path as varchar(max));
go

-- 
create proc sp_get_all_womens
as
select 
	p.productName, p.productDescription, p.category,
	p.size, p.unitPrice, cast(p.image_path as varchar(max)),
	count(pv.variantID) as 'available quantity', p.currentStock,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.threshold, p.createdAt
from 
	products as p
left join 
	ProductVariants as pv
	on p.productID = pv.productID
where 
	p.isActive = 1 and pv.isAvailable =1  and p.category = 'Women''s Leather Shoes'
group by 
	p.productName, p.productDescription, p.category, p.size, p.unitPrice, p.warehouseID,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.currentStock, p.threshold,
	cast(p.image_path as varchar(max)), p.createdAt
order by p.createdAt desc
go

--
create proc sp_get_all_mens
as
select 
	p.productName, p.productDescription, p.category,
	p.size, p.unitPrice, cast(p.image_path as varchar(max)),
	count(pv.variantID) as 'available quantity', p.currentStock,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.threshold, p.createdAt
from 
	products as p
left join 
	ProductVariants as pv
	on p.productID = pv.productID
where 
	p.isActive = 1 and pv.isAvailable =1  and p.category = 'Men''s Leather Shoes'
group by 
	p.productName, p.productDescription, p.category, p.size, p.unitPrice, p.warehouseID,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.currentStock, p.threshold,
	cast(p.image_path as varchar(max)), p.createdAt
order by p.createdAt desc
go

--
create proc sp_get_all_boys
as
select 
	p.productName, p.productDescription, p.category,
	p.size, p.unitPrice, cast(p.image_path as varchar(max)),
	count(pv.variantID) as 'available quantity', p.currentStock,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.threshold, p.createdAt
from 
	products as p
left join 
	ProductVariants as pv
	on p.productID = pv.productID
where 
	p.isActive = 1 and pv.isAvailable =1  and p.category = 'Boys''s Leather Shoes'
group by 
	p.productName, p.productDescription, p.category, p.size, p.unitPrice, p.warehouseID,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.currentStock, p.threshold,
	cast(p.image_path as varchar(max)), p.createdAt
order by p.createdAt desc
go

--
create proc sp_get_all_girls
as
select 
	p.productName, p.productDescription, p.category,
	p.size, p.unitPrice, cast(p.image_path as varchar(max)),
	count(pv.variantID) as 'available quantity', p.currentStock,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.threshold, p.createdAt
from 
	products as p
left join 
	ProductVariants as pv
	on p.productID = pv.productID
where 
	p.isActive = 1 and pv.isAvailable =1  and p.category = 'Girl''s Leather Shoes'
group by 
	p.productName, p.productDescription, p.category, p.size, p.unitPrice, p.warehouseID,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.currentStock, p.threshold,
	cast(p.image_path as varchar(max)), p.createdAt
order by p.createdAt desc
go

-- get one product
create proc sp_get_one_product
	@productID int
as
begin
select 
	p.productName, 
	p.productDescription,
	p.size, p.unitPrice,
	cast(p.image_path as varchar(max)),
	p.reorderLevel, 
	p.minStockLevel,
	p.maxStockLevel,
	p.warehouseID,
	count(pv.variantID) as 'available quantity',
	p.currentStock
from 
	products as p
left join 
	ProductVariants as pv
	on p.productID = pv.productID
where 
	p.productID = @productID and p.isActive = 1 and pv.isAvailable =1
group by 
	p.productName, p.productDescription, p.size, p.color, p.unitPrice, 
	p.warehouseID, p.reorderLevel, p.minStockLevel, p.maxStockLevel, 
	cast(p.image_path as varchar(max)), p.currentStock
end
go


-- get all available variants
create view vw_get_all_variants
as
select 
	p.productName, 
	pv.barcode, 
	pv.productCode, 
	p.productDescription, 
	p.size, 
	p.color, 
	p.unitPrice, 
	p.warehouseID,
	p.reorderLevel, 
	p.minStockLevel, 
	p.maxStockLevel
from 
	Products as p
left join 
	ProductVariants as pv
on p.productID = pv.productID
		-- only returns variants that are available 
where p.isActive = 1 and pv.isAvailable = 1;
go

-- get one variant
create proc sp_get_one_variant
	@variantID int
as
begin
select 
	p.productName, pv.barcode, pv.productCode, 
	p.productDescription, p.size, p.color, p.unitPrice, p.warehouseID,
	p.reorderLevel, p.minStockLevel, p.maxStockLevel
from 
	Products as p
left join 
	ProductVariants as pv
on p.productID = pv.productID
where 
	p.isActive = 1 
	and pv.isAvailable = 1
	and pv.variantID =	@variantID
end
go

-- get all sizes of a product
create proc sp_get_all_sizes_of_a_product
	@productName varchar (100),
	@category varchar(100)
--	,@productDesc varchar(500)
as
begin
SELECT
	size, 
	currentStock AS quantity, 
	minStockLevel AS minQuantity, 
	maxStockLevel AS maxQuantity, 
	reorderLevel AS reorderQuantity, 
	threshold 
FROM 
	Products 
WHERE
	productName = @productName 
	AND category = @category
	and isActive = 1
	and currentStock >= 1
  --  AND (productDescription = @productDesc OR @productDesc IS NULL)
end
go

-- add new product
create proc sp_add_product
	@productName varchar(100),
	@productDesc varchar(500),
	@size varchar (50),
	@color varchar(50),
	@category varchar(100),
	@unitPrice decimal(18,2),
	@threshold int,
	@reorderLevel int,
	@minStockLevel int,
	@maxStockLevel int,
	@quantity int,
	@image_path varchar(max),
	@newProductID int output
as
begin
	set nocount on;
	declare @productID int;
	declare	@counter int = 0;
	
	begin transaction

	begin try
		-- check if product already exists
		if exists (
			select 1 from Products
			where productName = @productName
				and size = @size
				and category = @category 
				AND isActive = 1
			)
		begin
			raiserror('a product with the same name, size, and category already exists.', 16, 1)
			rollback transaction; -- abort transaction if product already existst
			return;
		end;

		-- insert the new product
		insert into Products
		( productName, productDescription, size, color, category,  
			unitPrice, threshold, reorderLevel, minStockLevel, maxStockLevel, currentStock, image_path )
		values
		(@productName, @productDesc, @size, @color, @category,
			@unitPrice, @threshold, @reorderLevel, @minStockLevel, @maxStockLevel, @quantity, @image_path
		);

		set @productID = IDENT_CURRENT('Products');
		set @newProductID = @productID;

		if @newProductID is null
		begin 
			raiserror('failed to retrieve new product ID.', 16,1)
			rollback transaction;
			return;
		end;

		-- insert multiple variants based on quantity
		while @counter < @quantity
		begin 
			insert into ProductVariants (barcode, productCode, productID)
			values (
			(select top 1 UPPER(LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 13))), -- generate barcode
			(select top 1 UPPER(LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 8))), -- generate sku 
			@productID
			);
			set @counter = @counter + 1;
		end;

		commit transaction;
	end try
	begin catch
		rollback transaction;
		throw;
	end catch
end;
go


-- add quantities to existing product
create proc sp_add_product_quantity
	@productName varchar(100),
	@size varchar(50),
	@category varchar(100),
	@quantity int,
	@newStock int output

as 
begin
	set nocount on;
	declare @productID int;
	declare @currentStock int;
	declare @counter int =0;

	begin transaction;

	begin try
		-- retrive productID and currentSotck
		select @productID = productID, @currentStock = currentStock
		from Products
		where productName = @productName
			and size = @size and category = @category 
			and isActive=1;

		-- check if product exists
		if @productID is null
		begin 
			raiserror('product not found.', 16,1);
			rollback transaction;
			return;
		end;

		-- insert new variants into ProductVariants table
		while @counter < @quantity
		begin
			insert into ProductVariants (barcode, productCode, productID)
			values (
			(select top 1 UPPER(LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 13))), -- generate barcode
			(select top 1 UPPER(LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 8))), -- generate sku 
			@productID
			);
			set @counter = @counter + 1;
		end;

		-- update stock in Products table
		set @newStock = @currentStock + @quantity;
		update Products  set currentStock = @newStock
		where productID = @productID;

		commit transaction;

	end try
	begin catch
		rollback transaction;
		throw;
	end catch
end;
go


-- edit size product
create proc sp_update_product
	@productName varchar(100),
	@productDescription varchar(255),
    @size varchar(50),
    @category varchar(100),
    @unitPrice decimal(10,2),
    @newSize varchar(50),
    @minStockLevel int,
    @maxStockLevel int,
    @reorderLevel int,
    @threshold int
as
begin
	set nocount on;

	declare @productID int;

	begin transaction;

	begin try
		-- get the productID
		select @productID = productID
		from Products
		where productName = @productName and productDescription = @productDescription
		and size = @size and category = @category and unitPrice = @unitPrice and isActive = 1;

		if @productID is null
		begin
			raiserror('product not found.', 16, 1);
			rollback transaction;
			return;
		end;

		-- update product fields
		update Products
		set size = @newSize, minStockLevel = @minStockLevel, maxStockLevel = @maxStockLevel,
            reorderLevel = @reorderLevel, threshold = @threshold
        where productID = @productID and isActive = 1;

		commit transaction;
	end try
	begin catch
		rollback transaction;
		throw;
	end catch

end;
go


-- add new size to exisitng product
create proc sp_add_product_size
	@productName varchar(100),
    @productDescription varchar(255),
    @size varchar(50),
    @category varchar(100),
    @unitPrice decimal(10,2),
    @threshold int,
    @reorderLevel int,
    @minStockLevel int,
    @maxStockLevel int,
    @quantity int,
	@image_path varchar(255) output

as 
begin
	set nocount on;
	
	declare @productID int;
	declare @counter int = 0;

	begin transaction;

	begin try
		--check if the product already exists
		if exists (
		select 1 from Products
		where productName = @productName and productDescription = @productDescription and size = @size and isActive = 1
		)
		begin
			raiserror ('product with this size already exists.',16, 1);
			rollback transaction;
			return;
		end;

		-- insert the new size into Products table
		insert into Products (productName, productDescription, size, category, unitPrice, threshold, reorderLevel, minStockLevel, maxStockLevel, currentStock, image_path)  
        values (@productName, @productDescription, @size, @category, @unitPrice, @threshold, @reorderLevel, @minStockLevel, @maxStockLevel, @quantity, @image_path);

		-- get the last inserted productID
		set @productID = IDENT_CURRENT('Products');

		--insert multiple variants into ProductVariants tbale based on inputtedquantity
		while @counter < @quantity
		begin
			insert into ProductVariants (barcode, productCode, productID)  
            values (  
                (select top 1 UPPER(LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 13))), -- Generate barcode  
                (select top 1 UPPER(LEFT(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', ''), 8))),  -- Generate SKU   
                @productID  
            );  
            set @counter = @counter + 1;  
        end;  
		
		commit transaction;
	
	end try
	begin catch
		rollback transaction;
		throw;
	end catch
end;
go


-- update details of a product
create proc sp_update_product_details
	@productName varchar(100),
    @productDescription varchar(255),
    @category varchar(100),
    @unitPrice decimal(10,2),
    @newProductName varchar(100),
    @newProductDescription varchar(255),
    @newCategory varchar(100),
    @newUnitPrice decimal(10,2),
	@updatedProductName varchar(100) OUTPUT,  
    @updatedProductDescription varchar(255) OUTPUT,  
    @updatedCategory varchar(100) OUTPUT,  
    @updatedUnitPrice decimal(10, 2) OUTPUT,  
    @image_path varchar(255) OUTPUT

as 
begin
	set nocount on;

	declare @productID int;

	begin transaction;

	begin try
		-- find the product
		select @productID = productID
        from Products
        where productName = @productName AND productDescription = @productDescription 
              AND category = @category AND unitPrice = @unitPrice AND isActive = 1;

		if @productID is null
		begin 
			raiserror('Product not found.', 16, 1);
			rollback transaction;
			return;
		end;

		-- update product details
		update Products
		set productName = @newProductName, productDescription = @newProductDescription,
            category = @newCategory, unitPrice = @newUnitPrice
        where productID = @productID AND isActive = 1;

		-- fetch updated product details
		select 
			@updatedProductName = productName,  
            @updatedProductDescription = productDescription,  
            @updatedCategory = category,  
            @updatedUnitPrice = unitPrice,  
            @image_path = image_path
		from Products
		where productID = @productID AND isActive = 1;

		commit transaction;
	end try
	begin catch
		rollback transaction;
		throw;
	end catch
end;
go

-- get variants of sizes
create proc sp_get_variants_per_size
	@productName varchar(100),
	@productDesc varchar(500),
	@category varchar(100)
as
begin
	SELECT 
		p.size, 
		pv.productCode, 
		pv.barcode
	FROM
		Products AS p
	INNER JOIN
		ProductVariants AS pv
	ON
		p.productID = pv.productID
	WHERE
		p.isActive = 1
		AND pv.isAvailable = 1
		AND p.productName = @productName
		AND p.category = @category
		AND p.productDescription = @productDesc;
end;
go


-- soft delete a product variant
create proc sp_delete_product_variant
	@variantID int,
	@updatedStock int output

as
begin
	set nocount on;

	declare @productID int;

	begin transaction;

	begin try
		-- get the productID of the variant to be deleted
		select @productID = productID
		from ProductVariants
		where variantID = @variantID and isAvailable =1

		if @productID is null
		begin
			raiserror('Product variant not found or already deleted.', 16, 1);  
			rollback transaction;
			return;
		end;

		-- soft delete the product variant 
		update ProductVariants
		set isAvailable = 0  
        where variantID = @variantID;

		-- decrease currentStock in Products table
		update Products  
        set currentStock = currentStock - 1  
        where productID = @productID;  

		commit transaction;
	end try
	begin catch
		rollback transaction;
		throw;
	end catch
end;
go

-- soft delete a size of a product
create proc sp_soft_delete_size
	@productName VARCHAR(100),  
    @unitPrice DECIMAL(10, 2),  
    @category VARCHAR(100),  
    @size VARCHAR(50) 

as
begin 
	set nocount on;

	begin transaction;

	begin try
		-- check if the size exists and is currently active  
        DECLARE @sizeExists INT;  

        SELECT @sizeExists = COUNT(*)  
        FROM Products   
        WHERE productName = @productName   
          AND unitPrice = @unitPrice   
          AND category = @category   
          AND size = @size   
          AND isActive = 1;  

        IF @sizeExists = 0  
        BEGIN  
            RAISERROR('Product size not found or already inactive.', 16, 1);  
            ROLLBACK TRANSACTION;  
            RETURN;  
        END 

		-- prform the soft delete by setting isActive to 0  
        UPDATE Products   
        SET isActive = 0   
        WHERE productName = @productName   
          AND unitPrice = @unitPrice   
          AND category = @category   
          AND size = @size;  

        commit transaction;  
    end try  
    begin catch  
        rollback transaction;  
        throw;  
    end catch  
end;  
go


-- soft delete products
create proc sp_soft_delete_products
	@productName VARCHAR(100),  
    @category VARCHAR(100)

as
begin 
	set nocount on;

	begin transaction;

	begin try
		-- check if products exists and are currently active  
        DECLARE @productCount INT;  

        SELECT @productCount = COUNT(*)  
        FROM Products   
        WHERE productName = @productName   
          AND category = @category   
          AND isActive = 1;  

        IF @productCount = 0  
        BEGIN  
            RAISERROR('No active products found for the given product name and category.', 16, 1);  
            ROLLBACK TRANSACTION;  
            RETURN;  
        END  

		-- prform the soft delete by setting isActive to 0 for all matching products  
        UPDATE Products   
        SET isActive = 0   
        WHERE productName = @productName   
          AND category = @category   

        commit transaction;  
    end try  
    begin catch  
        rollback transaction;  
        throw;  
    end catch  
end;  
go

create proc sp_get_order_details
	@orderID int
as
begin
SELECT 
	po.orderDate, v.vendorID, v.vendorName, 
    w.warehouseID, w.warehouseName, w.building, w.street, 
    w.barangay, w.city, w.country, w.zipcode, 
    p.productName, p.productDescription, p.size, p.color, p.category,
    pod.orderQuantity, pod.expectedDate, u.userID, u.firstName, u.lastName
FROM 
	PurchaseOrders po
JOIN 
	Vendors v ON po.vendorID = v.vendorID
JOIN 
	PurchaseOrderDetails pod ON po.orderID = pod.orderID
JOIN 
	Warehouses w ON pod.warehouseID = w.warehouseID
JOIN 
	ProductVariants pv ON pod.variantID = pv.variantID
JOIN 
	Products p ON pv.productID = p.productID
JOIN 
	Users u ON po.userID = u.userID
WHERE po.orderID = @orderID;
end;
go

-- mark orders as received
create proc sp_mark_order_received
	@orderID int

as 
begin 
	set nocount on;

	begin transaction;

	begin try
		-- check if order exists and is marked as Delivered  
        DECLARE @orderStatus VARCHAR(50);  
        
        SELECT @orderStatus = orderStatus   
        FROM purchaseOrders   
        WHERE orderID = @orderID;  

        IF @orderStatus IS NULL  
        BEGIN  
            RAISERROR('Order not found.', 16, 1);  
            ROLLBACK TRANSACTION;  
            RETURN;  
        END  

        IF @orderStatus != 'Delivered'  
        BEGIN  
            RAISERROR('Order is not marked as Delivered.', 16, 1);  
            rollback transaction;
			return;
		end

		-- update order status to REceived in IMS 
		update PurchaseOrders
		SET orderStatus = 'Received',  
            statusDate = GETDATE()  
        WHERE orderID = @orderID;  

		commit transaction;  
    end try  
    begin catch  
        rollback transaction;  
        throw;  
    end catch  
end;  
go

-- get all PO // not used
create proc sp_get_all_PO
	@orderID int
as
begin
	select 
		po.orderid,
		po.orderdate,
		po.orderstatus,
		po.statusdate,
    
		-- vendor details
		v.vendorid,
		v.vendorname,
		(isnull(v.building, '') + ', ' + isnull(v.street, '') + ', ' + isnull(v.barangay, '') + ', ' + 
		 isnull(v.city, '') + ', ' + isnull(v.country, '') + ', ' + isnull(v.zipcode, '')) as vendoraddress,
    
		-- user details
		u.userid,
		concat(u.firstname, ' ', u.lastname) as orderedby,
    
		-- purchase order details
		pod.orderdetailid,
		pod.orderquantity,
		pod.expecteddate,
		pod.actualdate,
    
		-- product details
		p.productid,
		p.productname,
		p.productdescription,
		p.size,
		p.color,
		p.category,

		-- warehouse details
		w.warehouseid,
		w.warehousename,
		(isnull(w.building, '') + ', ' + isnull(w.street, '') + ', ' + isnull(w.barangay, '') + ', ' + 
		 isnull(w.city, '') + ', ' + isnull(w.country, '') + ', ' + isnull(w.zipcode, '')) as warehouseaddress

	from 
		purchaseorders po
	left join 
		vendors v on po.vendorid = v.vendorid
	left join 
		users u on po.userid = u.userid
	left join 
		purchaseorderdetails pod on po.orderid = pod.orderid
	left join 
		warehouses w on pod.warehouseid = w.warehouseid
	left join 
		productvariants pv on pod.variantid = pv.variantid
	left join 
		products p on pv.productid = p.productid

	order by 
		po.orderdate desc;
end;


-- unsync ----------------------------------------------------------------------------
