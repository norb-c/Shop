﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Shop.API.Persistance;

namespace Shop.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ValuesController : ControllerBase
	{
		private readonly DataContext context;
		public ValuesController(DataContext context)
		{
			this.context = context;
		}

		// GET api/values
		[HttpGet]
		public IActionResult Get()
		{
			var values = this.context.Values.ToList();
			return Ok(values);
		}

		// GET api/values/5
		[HttpGet("{id}")]
		public IActionResult Get(int id)
		{
			var value = this.context.Values.FirstOrDefault(x => x.Id == id);
			return Ok(value);
		}

		// POST api/values
		[HttpPost]
		public void Post([FromBody] string value)
		{
		}

		// PUT api/values/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] string value)
		{
		}

		// DELETE api/values/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}
	}
}
