using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PointAndComment.Application.DTO;
using PointAndComment.Application.Interface;
using PointAndComment.Application.Service;
using PointAndComment.Infrastructure;
using PointAndComment.Infrastructure.Repository;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();  
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PointsAndCommentsDbContext>(options =>
    options.UseInMemoryDatabase("PointsAndCommentsDb"));

builder.Services.AddScoped<IPointRepository, PointRepository>();
builder.Services.AddScoped<IPointService, PointService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()   
            .AllowAnyMethod()   
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

app.MapGet("/points", async ([FromServices] IPointService service) =>
{
    var points = await service.GetAllAsync();
    return Results.Ok(points);
});
app.MapGet("/points/{id:guid}", async (Guid id, [FromServices] IPointService service) =>
{
    var points = await service.GetByIdAsync(id);
    return Results.Ok(points);
});

app.MapPost("/points", async ([FromBody] PointDto dto, [FromServices] IPointService service) =>
{
    var createdPoint = await service.AddAsync(dto);
    return Results.Created($"/points/{dto.Id}", createdPoint);
});

app.MapDelete("/points/{id:guid}", async (Guid id, [FromServices] IPointService service) =>
{
    await service.DeleteAsync(id);
    return Results.NoContent();
});

app.MapPut("/points/{id:guid}/color", async (Guid id, [FromBody] string newColor, [FromServices] IPointService service) =>
{
    await service.UpdateColorAsync(id, newColor);
    return Results.Ok();
});

app.MapPut("/points/{id:guid}/position", async (Guid id, [FromBody] PointPositionDto pos, [FromServices] IPointService service) =>
{
    await service.UpdatePositionAsync(id, pos);
    return Results.Ok();
});

app.MapPost("/points/{id:guid}/comments", async (Guid id, [FromBody] CommentDto dto, [FromServices] IPointService service) =>
{
    await service.AddCommentAsync(id, dto);
    return Results.Ok();
});

app.MapPut("/comments/{commentId:guid}", async (Guid commentId, [FromBody] CommentDto dto, [FromServices] IPointService service) =>
{
    await service.UpdateCommentAsync(commentId, dto);
    return Results.Ok();
});

app.MapDelete("/comments/{commentId:guid}", async (Guid commentId, [FromServices] IPointService service) =>
{
    await service.DeleteCommentAsync(commentId);
    return Results.NoContent();
});

app.Run();

