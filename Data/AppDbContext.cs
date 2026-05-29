using Microsoft.EntityFrameworkCore;
using TaskManager.API.Models;

namespace TaskManager.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.AssignedTo).HasMaxLength(100);
            entity.Property(e => e.Priority).HasConversion<string>();
            entity.Property(e => e.Status).HasConversion<string>();

            entity.HasData(
                new TaskItem { Id = 1, Title = "Set up CI/CD pipeline", Description = "Configure Azure DevOps pipelines", Priority = TaskPriority.High, Status = Models.TaskStatus.InProgress, AssignedTo = "Arjun", DueDate = DateTime.UtcNow.AddDays(3), CreatedAt = DateTime.UtcNow },
                new TaskItem { Id = 2, Title = "Write unit tests for Auth module", Description = "Cover login, token refresh and logout", Priority = TaskPriority.Medium, Status = Models.TaskStatus.Todo, AssignedTo = "Priya", DueDate = DateTime.UtcNow.AddDays(7), CreatedAt = DateTime.UtcNow },
                new TaskItem { Id = 3, Title = "Design SQL schema for Reports", Description = "Tables for report metadata and filters", Priority = TaskPriority.High, Status = Models.TaskStatus.Todo, AssignedTo = "Ravi", DueDate = DateTime.UtcNow.AddDays(5), CreatedAt = DateTime.UtcNow },
                new TaskItem { Id = 4, Title = "Fix React form validation bug", Description = "Due date field allows past dates", Priority = TaskPriority.Low, Status = Models.TaskStatus.Done, AssignedTo = "Sneha", DueDate = DateTime.UtcNow.AddDays(-1), CreatedAt = DateTime.UtcNow }
            );
        });
    }
}
