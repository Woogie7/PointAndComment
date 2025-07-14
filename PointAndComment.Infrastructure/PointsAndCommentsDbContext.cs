using Microsoft.EntityFrameworkCore;
using PointAndComment.Domain.Entities;

namespace PointAndComment.Infrastructure;

public class PointsAndCommentsDbContext : DbContext
{
    public PointsAndCommentsDbContext(DbContextOptions<PointsAndCommentsDbContext> options) : base(options)
    {
    }

    public DbSet<Point> Points { get; set; }
    public DbSet<Comment> Comments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Point>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Color).IsRequired();
            entity.Property(p => p.X).IsRequired();
            entity.Property(p => p.Y).IsRequired();
            entity.Property(p => p.Radius).IsRequired();

            modelBuilder.Entity<Point>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Point)
                .HasForeignKey(c => c.PointId)
                .OnDelete(DeleteBehavior.Cascade); 
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Text).IsRequired();
            entity.Property(c => c.BackgroundColor).IsRequired();
        });
    }
}
