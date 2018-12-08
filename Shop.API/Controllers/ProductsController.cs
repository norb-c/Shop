using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Shop.API.Core;
using Shop.API.Core.Models;
using Shop.API.Dtos.ProductDto;

namespace Shop.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProductsController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly IUnitOfWork unitOfWork;
		private readonly IProductRepository repo;
		public ProductsController(IMapper mapper, IUnitOfWork unitOfWork, IProductRepository repo)
		{
			this.repo = repo;
			this.unitOfWork = unitOfWork;
			this.mapper = mapper;

		}

		[HttpGet]
		public async Task<IActionResult> GetProducts()
		{
			var products = await this.repo.GetProducts();

			var productToList = this.mapper.Map<IEnumerable<ProductForList>>(products);

			return Ok(productToList);
		}

		[HttpGet("{id}", Name = "GetProduct")]
		public async Task<IActionResult> GetProduct(int id)
		{
			var product = await this.repo.GetProduct(id);

			var productForDetail = this.mapper.Map<ProductForDetail>(product);

			if (productForDetail == null)
				return NotFound();

			return Ok(productForDetail);
		}

		[HttpPost]
		public async Task<IActionResult> CreateProdut(ProductForCreationOrUpdate productForCreation)
		{
			var product = this.mapper.Map<Product>(productForCreation);
			product.Created = DateTime.Now;
			product.LastUpdated = DateTime.Now;

			this.unitOfWork.Add(product);


			if (await this.unitOfWork.CompleteAsync())
			{
				var productToReturn = this.mapper.Map<ProductToReturn>(product);
				return CreatedAtRoute("GetProduct", new { id = product.Id }, productToReturn);
			}
			return BadRequest("Could not create the product");


		}

		[HttpPut("{id}")]
		public async Task<IActionResult> Updateproduct(int id, ProductForCreationOrUpdate productForUpdate)
		{
			var product = await this.repo.GetProduct(id);
			product.LastUpdated = DateTime.Now;

			this.mapper.Map(productForUpdate, product);

			if (await this.unitOfWork.CompleteAsync())
			{
				var productToReturn = this.mapper.Map<ProductToReturn>(product);
				return CreatedAtRoute("GetProduct", new { id = product.Id }, productToReturn);
			}
			return BadRequest("Could not update the product");

		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteProduct(int id)
		{
			var product = await this.repo.GetProduct(id);
			this.unitOfWork.Remove(product);

			if (await this.unitOfWork.CompleteAsync())
				return Ok(id);

			return BadRequest("Could not create the product");

		}
	}
}