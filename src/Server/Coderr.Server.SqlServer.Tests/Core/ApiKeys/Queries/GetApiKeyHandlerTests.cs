﻿using System;
using codeRR.Server.Api.Core.ApiKeys.Queries;
using codeRR.Server.App.Core.ApiKeys;
using codeRR.Server.App.Core.Applications;
using codeRR.Server.SqlServer.Core.ApiKeys;
using codeRR.Server.SqlServer.Core.ApiKeys.Queries;
using codeRR.Server.SqlServer.Core.Applications;
using DotNetCqs;
using FluentAssertions;
using Griffin.Data;
using NSubstitute;
using Xunit;

namespace codeRR.Server.SqlServer.Tests.Core.ApiKeys.Queries
{
    [Collection(MapperInit.NAME)]
    public class GetApiKeyHandlerTests : IDisposable
    {
        private Application _application;
        private readonly ApiKey _existingEntity;
        private readonly IAdoNetUnitOfWork _uow;

        public GetApiKeyHandlerTests()
        {
            _uow = ConnectionFactory.Create();
            GetApplication();

            _existingEntity = new ApiKey
            {
                ApplicationName = "Arne",
                GeneratedKey = Guid.NewGuid().ToString("N"),
                SharedSecret = Guid.NewGuid().ToString("N"),
                CreatedById = 20,
                CreatedAtUtc = DateTime.UtcNow
            };

            _existingEntity.Add(_application.Id);
            var repos = new ApiKeyRepository(_uow);
            repos.CreateAsync(_existingEntity).Wait();
        }

        public void Dispose()
        {
            _uow.Dispose();
        }


        [Fact]
        public async void should_Be_able_to_fetch_existing_key_by_id()
        {
            var query = new GetApiKey(_existingEntity.Id);
            var context = Substitute.For<IMessageContext>();

            var sut = new GetApiKeyHandler(_uow);
            var result = await sut.HandleAsync(context, query);

            result.Should().NotBeNull();
            result.GeneratedKey.Should().Be(_existingEntity.GeneratedKey);
            result.ApplicationName.Should().Be(_existingEntity.ApplicationName);
            result.AllowedApplications[0].ApplicationId.Should().Be(_application.Id);
            result.AllowedApplications[0].ApplicationName.Should().Be(_application.Name);
        }

        private void GetApplication()
        {
            var repos = new ApplicationRepository(_uow);
            var id = _uow.ExecuteScalar("SELECT TOP 1 Id FROM Applications");
            if (id is DBNull || id is null)
            {
                _application = new Application(10, "AppTen");
                repos.CreateAsync(_application).Wait();
            }
            else
            {
                _application = repos.GetByIdAsync((int) id).Result;
            }
        }
    }
}