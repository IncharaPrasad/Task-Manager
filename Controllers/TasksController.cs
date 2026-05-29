using TaskStatus = TaskManager.API.Models.TaskStatus;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Models;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll([FromQuery] TaskStatus? status)
    {
        var tasks = status.HasValue
            ? await _taskService.GetByStatusAsync(status.Value)
            : await _taskService.GetAllAsync();
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetById(int id)
    {
        var task = await _taskService.GetByIdAsync(id);
        return task is null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create([FromBody] CreateTaskDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest("Title is required.");

        var task = await _taskService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskItem>> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        var updated = await _taskService.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _taskService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary()
    {
        var all = await _taskService.GetAllAsync();
        var list = all.ToList();
        return Ok(new
        {
            Total = list.Count,
            Todo = list.Count(t => t.Status == TaskStatus.Todo),
            InProgress = list.Count(t => t.Status == TaskStatus.InProgress),
            Done = list.Count(t => t.Status == TaskStatus.Done),
            HighPriority = list.Count(t => t.Priority == TaskPriority.High)
        });
    }
}
