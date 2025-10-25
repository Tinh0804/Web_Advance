using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using src.Domain.Entities;
using src.Domain.Enums;
using src.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<UserAccount>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Migrate DB nếu chưa có
        await context.Database.MigrateAsync();

        // ====== Seed Roles ======
        var roles = new[] { SystemRoles.Admin, SystemRoles.Student };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // ====== Seed Permissions ======
        var permissions = new List<Permission>
        {
            new Permission { Name = "ManageUsers", Description = "Quản lý người dùng" },
            new Permission { Name = "ManageCourses", Description = "Quản lý khoá học" },
            new Permission { Name = "ViewProgress", Description = "Xem tiến độ học tập" },
            new Permission { Name = "EditProfile", Description = "Chỉnh sửa hồ sơ cá nhân" }
        };

        foreach (var perm in permissions)
        {
            if (!await context.Permissions.AnyAsync(p => p.Name == perm.Name))
            {
                context.Permissions.Add(perm);
            }
        }
        await context.SaveChangesAsync();

        // ====== Assign Permissions to Roles ======
        var adminRole = await roleManager.FindByNameAsync(SystemRoles.Admin);
        var studentRole = await roleManager.FindByNameAsync(SystemRoles.Student);

        var allPermissions = await context.Permissions.ToListAsync();

        // Admin có tất cả permissions
        foreach (var perm in allPermissions)
        {
            if (!context.RolePermissions.Any(rp => rp.RoleId == adminRole.Id && rp.PermissionId == perm.PermissionId))
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = adminRole.Id,
                    PermissionId = perm.PermissionId
                });
            }
        }

        // Student chỉ có một số permission
        var studentPermissions = allPermissions
            .Where(p => p.Name == "ViewProgress" || p.Name == "EditProfile");

        foreach (var perm in studentPermissions)
        {
            if (!context.RolePermissions.Any(rp => rp.RoleId == studentRole.Id && rp.PermissionId == perm.PermissionId))
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = studentRole.Id,
                    PermissionId = perm.PermissionId
                });
            }
        }

        await context.SaveChangesAsync();
        string adminEmail = "admin@languageapp.com";
        string adminPassword = "Admin123!";
        // Seed Admin User + Profile
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new UserAccount
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, SystemRoles.Admin);
                var nativeLanguage =await context.Languages.FindAsync(1);
                // Thêm UserProfile cho Admin
                var adminProfile = new UserProfile
                {
                    UserAccountId = adminUser.Id,          // Khóa chính cũng là UserId
                    FullName = "Administrator", // bạn có thể thêm field khác
                    NativeLanguage = nativeLanguage,
                    PhoneNumber = "0366900821"


                };
                context.UserProfiles.Add(adminProfile);
                await context.SaveChangesAsync();
            }
        }

        string studentEmail = "student@languageapp.com";
        string studentPassword = "Student123!";
        // Seed Student User + Profile
        var studentUser = await userManager.FindByEmailAsync(studentEmail);
        if (studentUser == null)
        {
            studentUser = new UserAccount
            {
                UserName = studentEmail,
                Email = studentEmail,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(studentUser, studentPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(studentUser, SystemRoles.Student);
                var nativeLanguage =await context.Languages.FindAsync(1);
                // Thêm UserProfile cho Student
                var studentProfile = new UserProfile
                {
                    UserAccountId = studentUser.Id,
                    FullName = "Student",
                    NativeLanguage = nativeLanguage,
                    CurrentStreak = 0,
                    TotalExperience = 0,
                    Hearts = 5,
                        PhoneNumber = "0366900822"

                };
                context.UserProfiles.Add(studentProfile);
                await context.SaveChangesAsync();
            }
        }

    }
}
